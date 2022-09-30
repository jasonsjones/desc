import { AuthTokenResponse, Credentials } from '../common/apiResponseTypes';
import { BASE_URL } from './util';

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

export function fetchSessionUser(): Promise<AuthTokenResponse> {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        credentials: 'include'
    }).then((response) => response.json());
}

export function refreshToken(): Promise<AuthTokenResponse> {
    return fetch(`${BASE_URL}/auth/token`, {
        credentials: 'include'
    }).then((res) => res.json());
}
