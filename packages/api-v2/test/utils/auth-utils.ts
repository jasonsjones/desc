import request from 'supertest';

export function extractCookieValueFromResHeader(
    header: request.Response['header'],
    cookieName: string
) {
    let value: string;
    if (header && header['set-cookie']?.length > 0) {
        const cookies = header['set-cookie'];
        // A single item array containing the full cookie string value
        const fullCookieString = cookies.filter((cooky: string) => cooky.startsWith(cookieName));
        if (fullCookieString.length) {
            const parts = fullCookieString[0].split(';');
            const cookie = parts.filter((p: string) => p.startsWith(cookieName));
            if (cookie.length === 1) {
                value = cookie[0].split('=')[1];
            }
        }
    }
    return value;
}
