import { placementInputSchema, projectInputSchema, publishProblems } from '../project-input';

const base = { id: 'aether', title: 'Aether' };

describe('projectInputSchema', () => {
    it('applies defaults', () => {
        const r = projectInputSchema.parse(base);
        expect(r).toMatchObject({ subtitle: '', is_nda: false, technologies: [], logo_svg: null, featured: false, featured_layout: null });
    });

    it('sanitises the logo on the way in', () => {
        const r = projectInputSchema.parse({ ...base, logo_svg: `<svg viewBox="0 0 1 1" onload="x()"><script>1</script><path d="M0 0"/></svg>` });
        expect(r.logo_svg).toBe(`<svg viewBox="0 0 1 1"><path d="M0 0"></path></svg>`);
    });

    it('turns an unusable logo into a readable error', () => {
        const r = projectInputSchema.safeParse({ ...base, logo_svg: '<div>nope</div>' });
        expect(r.success).toBe(false);
        expect(JSON.stringify(r.error?.issues)).toContain('single <svg>');
    });

    it('treats a blank logo as no logo', () => {
        expect(projectInputSchema.parse({ ...base, logo_svg: '   ' }).logo_svg).toBeNull();
    });

    it('normalises technologies from text and arrays', () => {
        expect(projectInputSchema.parse({ ...base, technologies: 'React,  Next.js , react,,' }).technologies).toEqual(['React', 'Next.js']);
    });

    it.each(['Aether', 'a b', 'a--b', '-a', 'a_b', ''])('rejects the id %j', (id) => {
        expect(projectInputSchema.safeParse({ ...base, id }).success).toBe(false);
    });

    it('rejects unknown featured layouts', () => {
        expect(projectInputSchema.safeParse({ ...base, featured_layout: 'huge' }).success).toBe(false);
    });
});

describe('publishProblems', () => {
    const p = { title: 'T', featured: false, featured_layout: null, featured_alt: null, featured_media_id: null, featured_image: null };
    it('is fine for an ordinary project', () => expect(publishProblems(p)).toEqual([]));
    it('requires layout, image and alt for a featured card', () => {
        expect(publishProblems({ ...p, featured: true })).toHaveLength(3);
        expect(publishProblems({ ...p, featured: true, featured_layout: 'hero', featured_image: '/images/a.webp', featured_alt: 'x' })).toEqual([]);
    });
});

describe('placementInputSchema', () => {
    const ok = { id: 'driq-health-ai', project_id: 'driq-health', section_id: '11111111-1111-4111-8111-111111111111', url: 'https://info.vansh.fyi/x' };
    it('accepts a valid placement', () => expect(placementInputSchema.safeParse(ok).success).toBe(true));
    it('rejects a bad section id', () => expect(placementInputSchema.safeParse({ ...ok, section_id: 'nope' }).success).toBe(false));
});
