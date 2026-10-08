import { isAdminEmail } from '../allow-list';
describe('isAdminEmail', () => {
    it('matches the configured address regardless of case and whitespace', () => {
        expect(isAdminEmail('Me@Example.com ', 'me@example.com')).toBe(true);
    });

    it.each([
        ['someone@else.com', 'me@example.com'],
        ['me@example.com.evil.io', 'me@example.com'],
        ['me+tag@example.com', 'me@example.com'],
    ])('rejects %s', (email, allowed) => expect(isAdminEmail(email, allowed)).toBe(false));

    it.each([
        [undefined, 'me@example.com'],
        [null, 'me@example.com'],
        ['', ''],
        ['me@example.com', ''],
        ['me@example.com', undefined],
    ])('rejects missing or empty values (%p, %p)', (email, allowed) => expect(isAdminEmail(email, allowed)).toBe(false));
});
