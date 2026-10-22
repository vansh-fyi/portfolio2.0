import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = `${root}public/images/optimized`;
await mkdir(output, { recursive: true });

const portraits = ['Greg', 'Varun', 'Narendra', 'Shreyas', 'Sulagna', 'Ankit'];
const projects = ['aether', 'driq', 'sparto', 'sparto_admin', 'vibio'];
const images = [
  ...portraits.map((name) => ({ name, widths: [48, 96, 144], quality: 90 })),
  ...projects.map((name) => ({ name, widths: [480, 768, 1280], quality: 90 })),
  { name: 'about_main', widths: [480, 768, 1024, 1440], quality: 90 },
  { name: 'about_theme', widths: [480, 768, 1024, 1440, 1920], quality: 90 },
  { name: 'hero_dark_focus', widths: [640, 1020], quality: 90 },
  { name: 'hero_light_focus', widths: [640, 1020], quality: 90 },
];

const manifest = {};
let total = 0;
for (const { name, widths, quality } of images) {
  const input = await readFile(`${root}public/images/${name}.webp`);
  const { width, height } = await sharp(input).metadata();
  const variants = [];
  for (const w of [...new Set(widths.map((w) => Math.min(w, width)))]) {
    const buffer = w === width ? input : await sharp(input).resize({ width: w }).webp({ quality, effort: 6 }).toBuffer();
    const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 12);
    const filename = `${name}.${hash}.${w}.webp`;
    await writeFile(`${output}/${filename}`, buffer);
    variants.push({ w, src: `/images/optimized/${filename}` });
    total += buffer.length;
  }
  manifest[`/images/${name}.webp`] = { width, height, variants };
}
await writeFile(`${root}lib/public-images.generated.json`, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${images.length} responsive image sets (${Math.round(total / 1024)} KiB across all sizes).`);
