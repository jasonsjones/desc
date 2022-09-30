import { AuthTokenResponse, Credentials } from '../common/apiResponseTypes';
import { BASE_URL } from './util';

function getCookieValue(key: string) {
    const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${key}=`))
        ?.split('=')[1];

    return cookieValue;
}

export async function login(creds: Credentials): Promise<AuthTokenResponse> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
    });

    if (!res.ok) {
        const cause = await res.json();
        throw new Error(res.statusText, { cause });
    }

    return await res.json();
}

export async function logout() {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    });

    if (!res.ok) {
        const cause = await res.json();
        throw new Error(res.statusText, { cause });
    }

    return await res.json();
}

export async function fetchToken() {
    if (getCookieValue('authd')) {
        const res = await fetch(`${BASE_URL}/auth/token`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const cause = await res.json();
            throw new Error(res.statusText, { cause });
        }

        return await res.json();
    }

    return Promise.resolve({ msg: 'token not available' });
}
