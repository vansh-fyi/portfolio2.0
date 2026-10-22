import { parseChatActions, stripCitationArtifacts } from '../../../lib/chat';

describe('chat response cleanup', () => {
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
