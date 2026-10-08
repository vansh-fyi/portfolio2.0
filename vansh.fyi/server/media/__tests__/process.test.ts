import sharp from 'sharp';
import zlib from 'node:zlib';
import { ImageError, processImage, targetWidths } from '../process';
import { idFromOriginalPath, MAX_UPLOAD_BYTES, originalPath, UploadError, validateUploadRequest, variantPath } from '../upload';

const solid = (width: number, height: number) => sharp({ create: { width, height, channels: 3, background: { r: 200, g: 60, b: 90 } } });

describe('targetWidths', () => {
    it.each([
        [4000, [640, 1280, 1920]],
        [1920, [640, 1280, 1920]],
        [1000, [640, 1000]],
        [640, [640]],
        [300, [300]],
    ])('source %d -> %j (never upscales)', (source, expected) => expect(targetWidths(source)).toEqual(expected));
});

describe('processImage', () => {
    it('makes WebP variants at 640/1280/1920 for a large photo', async () => {
        const out = await processImage(await solid(2400, 1200).jpeg().toBuffer());
        expect(out.variants.map((v) => v.w)).toEqual([640, 1280, 1920]);
        expect(out.width).toBe(1920);
        expect(out.height).toBe(960);
        expect(out.mime).toBe('image/jpeg');
        for (const v of out.variants) expect((await sharp(v.data).metadata()).format).toBe('webp');
    });

    it('keeps small images small (one variant at their own width)', async () => {
        const out = await processImage(await solid(300, 200).png().toBuffer());
        expect(out.variants.map((v) => v.w)).toEqual([300]);
        expect(out.mime).toBe('image/png');
    });

    it('strips EXIF (including GPS location) from every variant', async () => {
        const withGps = await solid(1500, 1000)
            .jpeg()
            .withExif({ IFD0: { Copyright: 'secret-copyright' }, IFD3: { GPSLatitudeRef: 'N', GPSLatitude: '51/1 30/1 0/1', GPSLongitudeRef: 'W', GPSLongitude: '0/1 7/1 0/1' } })
            .toBuffer();
        expect((await sharp(withGps).metadata()).exif).toBeDefined(); // the input really has EXIF

        const out = await processImage(withGps);
        for (const v of out.variants) {
            const meta = await sharp(v.data).metadata();
            expect(meta.exif).toBeUndefined();
            expect(meta.icc).toBeUndefined();
            expect(v.data.includes(Buffer.from('secret-copyright'))).toBe(false);
        }
    });

    it('applies the EXIF orientation, so a sideways phone photo comes out upright', async () => {
        const sideways = await solid(2000, 1000).jpeg().withMetadata({ orientation: 6 }).toBuffer();
        const out = await processImage(sideways);
        // 2000x1000 stored with rotate-90 means the real picture is 1000 wide and 2000 tall
        expect(out.variants.map((v) => v.w)).toEqual([640, 1000]);
        expect(out.width).toBe(1000);
        expect(out.height).toBe(2000);
    });

    it('creates a tiny blur placeholder as a data URL', async () => {
        const out = await processImage(await solid(800, 600).jpeg().toBuffer());
        expect(out.blurDataUrl).toMatch(/^data:image\/webp;base64,/);
        expect(out.blurDataUrl.length).toBeLessThan(2000);
    });

    it('accepts GIF and WebP originals', async () => {
        expect((await processImage(await solid(100, 100).gif().toBuffer())).mime).toBe('image/gif');
        expect((await processImage(await solid(100, 100).webp().toBuffer())).mime).toBe('image/webp');
    });

    it('rejects SVG (even though the image library can read it)', async () => {
        const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><script>alert(1)</script><rect width="10" height="10"/></svg>');
        await expect(processImage(svg)).rejects.toThrow(/SVG/);
    });

    it.each([
        ['random bytes', Buffer.from('definitely not an image')],
        ['an empty file', Buffer.alloc(0)],
        ['an HTML file', Buffer.from('<html><body>hi</body></html>')],
    ])('rejects %s', async (_name, input) => {
        await expect(processImage(input)).rejects.toBeInstanceOf(ImageError);
    });

    it('rejects images over the pixel limit before decoding them', async () => {
        // A few hundred bytes: a valid PNG header claiming 20000 x 20000 pixels (400 MP)
        const chunk = (type: string, data: Buffer) => {
            const body = Buffer.concat([Buffer.from(type), data]);
            const length = Buffer.alloc(4);
            length.writeUInt32BE(data.length);
            const crc = Buffer.alloc(4);
            crc.writeUInt32BE(zlib.crc32(body));
            return Buffer.concat([length, body, crc]);
        };
        const ihdr = Buffer.alloc(13);
        ihdr.writeUInt32BE(20_000, 0);
        ihdr.writeUInt32BE(20_000, 4);
        ihdr.set([8, 0, 0, 0, 0], 8); // 8-bit greyscale
        const bomb = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(Buffer.alloc(8))), chunk('IEND', Buffer.alloc(0))]);
        expect(bomb.length).toBeLessThan(200);
        await expect(processImage(bomb)).rejects.toThrow(/too many pixels/);
    });
});

describe('upload validation', () => {
    it('accepts the allowed types and returns the extension', () => {
        expect(validateUploadRequest({ mime: 'image/jpeg', bytes: 1000 })).toBe('jpg');
        expect(validateUploadRequest({ mime: 'image/avif', bytes: 1000 })).toBe('avif');
    });

    it.each([
        ['image/svg+xml', 1000, /SVG/],
        ['image/heic', 1000, /HEIC/],
        ['application/pdf', 1000, /JPEG, PNG/],
        ['image/png', 0, /empty/],
        ['image/png', MAX_UPLOAD_BYTES + 1, /too large/],
        ['image/png', NaN, /empty/],
    ])('rejects %s (%s bytes)', (mime, bytes, message) => {
        expect(() => validateUploadRequest({ mime, bytes })).toThrow(UploadError);
        expect(() => validateUploadRequest({ mime, bytes })).toThrow(message);
    });

    it('only recognises storage paths the server itself generates', () => {
        const id = '11111111-1111-4111-8111-111111111111';
        expect(idFromOriginalPath(originalPath(id, 'jpg'))).toBe(id);
        expect(variantPath(id, 640)).toBe(`v/${id}/640.webp`);
        for (const bad of [`originals/../secret.jpg`, `originals/${id}.svg`, `other/${id}.jpg`, `originals/${id}.jpg/extra`, `originals/not-a-uuid.jpg`, '']) {
            expect(idFromOriginalPath(bad)).toBeNull();
        }
    });
});
