import jwt from 'jsonwebtoken';
import { AuthTokenResponse, BaseAPIResponse, Credentials } from '../common/apiResponseTypes';
import { BASE_URL } from './util';

export function login(creds: Credentials): Promise<AuthTokenResponse> {
    return fetch(`${BASE_URL}/api/auth/login`, {
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
                success: false,
                message: 'unauthorized'
            };
        }
    });
}

export function logout(): Promise<BaseAPIResponse> {
    return fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include'
    }).then((response) => response.json());
}

export function fetchSessionUser(): Promise<AuthTokenResponse> {
    return fetch(`${BASE_URL}/api/users/me`, {
        method: 'GET',
        credentials: 'include'
    }).then((response) => response.json());
}

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

export function refreshToken(): Promise<AuthTokenResponse> {
    return fetch('http://localhost:3001/api/auth/refreshtoken', {
        credentials: 'include'
    }).then((res) => res.json());
}
