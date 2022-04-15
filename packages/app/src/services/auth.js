import { BASE_URL } from './util';

export function login(creds) {
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

export function logout() {
    return fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include'
    }).then((response) => response.json());
}

export const fetchSessionUser = () => {
    return fetch(`${BASE_URL}/api/users/me`, {
        method: 'GET',
        credentials: 'include'
    }).then((response) => response.json());
};

export function refreshToken() {
    return fetch('http://localhost:3001/api/auth/refreshtoken', {
        credentials: 'include'
    }).then((res) => res.json());
}
