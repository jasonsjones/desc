import { AuthTokenResponse, Credentials } from '../common/apiResponseTypes';
import { BASE_URL } from './util';

export function login(creds: Credentials): Promise<AuthTokenResponse> {
    return fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
    }).then((response) => {
        if (response.status === 200) {
            return response.json();
        }
        if (response.status === 401) {
            return {
                access_token: null,
                message: 'unauthorized'
            };
        }
    });
}

export function logout(): Promise<{ access_token: null }> {
    return fetch(`${BASE_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include'
    }).then((response) => response.json());
}

export async function doLogout() {
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

/*
export function getValidToken(currentToken: string): Promise<string> {
    const token = jwt.decode(currentToken) as jwt.JwtPayload;
    const tokenExpires = token.exp;
    const now = Date.now().valueOf() / 1000;
    if (tokenExpires && now > tokenExpires) {
        return refreshToken().then((data) => {
            if (data.payload?.accessToken) {
                return data.payload.accessToken;
            } else {
                return '';
            }
        });
    }
    return Promise.resolve(currentToken);
}
*/

export function refreshToken(): Promise<AuthTokenResponse> {
    return fetch(`${BASE_URL}/auth/token`, {
        credentials: 'include'
    }).then((res) => res.json());
}
