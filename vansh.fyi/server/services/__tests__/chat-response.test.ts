import { hasExperienceDuration, needsChatClarification, parseChatActions, stripChatLinks, stripCitationArtifacts } from '../../../lib/chat';

describe('chat response cleanup', () => {
    it.each(['He has 3 years of cumulative experience.', 'Vansh has about **four years of professional experience**.', 'His experience spans 5 years.', 'He has 3+ years of experience.'])('detects a fixed experience claim: %s', (text) => {
        expect(hasExperienceDuration(text)).toBe(true);
    });

    it.each(['He began his career in 2021.', 'He has worked at Tapforce since December 2025.', 'He taught at DIT University for a year.', 'His work improves the user experience.'])('preserves dates and role descriptions: %s', (text) => {
        expect(hasExperienceDuration(text)).toBe(false);
    });
    it.each([
        ['Read [Aether](https://www.vansh.fyi/projects/aether-ai).', 'Read Aether.'],
        ['Use [general chat](/chat).', 'Use general chat.'],
        ['Read [the post][post].\n\n[post]: https://www.vansh.fyi/blog/post', 'Read the post.'],
        ['Visit https://www.vansh.fyi/chat or vansh.fyi/chat', 'Visit or'],
        ['<a href="/chat">General chat</a>', 'General chat'],
        ['<https://www.vansh.fyi/chat>', ''],
        ['**Aether** uses React and TypeScript.', '**Aether** uses React and TypeScript.'],
        ['Email hello@vansh.fyi', 'Email'],
    ])('removes text navigation from %s', (raw, expected) => {
        expect(stripChatLinks(raw)).toBe(expected);
    });

    it('retains dedicated project actions while removing message links', () => {
        expect(parseChatActions('[Aether](/projects/aether) creates tokens.\n<action>view_projects</action>', 'personal'))
            .toEqual({ text: 'Aether creates tokens.', actions: ['view_projects'] });
    });

    it.each(['AI', 'Hi', 'Why?', 'Can I see those?', '1', 'Aether'])('allows meaningful short input %s', (query) => {
        expect(needsChatClarification(query)).toBe(false);
    });
    it('removes adjacent and standalone model citation markers from the reported response', () => {
        const raw = '【5†L9-L11】【4†L1-L4】\n\nAether creates design tokens. 【4†L1-L4】\n\nComponents have live previews.【4†L5-L9】';
        expect(stripCitationArtifacts(raw)).toBe('Aether creates design tokens.\n\nComponents have live previews.');
    });

    it('preserves links, ordinary brackets, typography and literal code', () => {
        const raw = '[Aether](https://www.vansh.fyi/projects/design-aether) supports [a, b]. 【見本】\n`【4†L1-L4】`\n```text\n【5†L9-L11】\n```';
        expect(stripCitationArtifacts(raw)).toBe(raw);
    });

    it('removes provider citation control tokens without changing Markdown lists', () => {
        expect(stripCitationArtifacts('- **Aether** creates tokens.\uE200cite\uE202turn0search0\uE201\n- **Ursa** answers questions.'))
            .toBe('- **Aether** creates tokens.\n- **Ursa** answers questions.');
    });

    it('does not offer a project button when only citation artifacts remain', () => {
        expect(parseChatActions('【5†L9-L11】<action>view_projects</action>', 'personal')).toEqual({ text: '', actions: [] });
    });
});
