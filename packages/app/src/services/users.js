import { BASE_URL } from './util';

export function getUsers({ queryKey }) {
    const [, { token }] = queryKey;
    return fetch(`${BASE_URL}/api/users`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((res) => {
        if (res.ok && res.status === 200) {
            return res.json();
        }
    });
}

export function signup(userData) {
    return fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    }).then((res) => {
        if (res.ok && res.status === 201) {
            return res.json();
        }
    });
}

export function updateUserData({ id, userData, token }) {
    return fetch(`${BASE_URL}/api/users/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    }).then((res) => {
        if (res.ok && res.status === 200) {
            return res.json();
        }
    });
}

export const confirmEmail = (token) => {
    return fetch(`${BASE_URL}/api/users/confirmemail/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
    }).then((res) => {
        if (res.ok && res.status === 200) {
            return res.json();
        }
    });
};

export const forgotPassword = (email) => {
    return fetch(`${BASE_URL}/api/users/forgotpassword`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    }).then((res) => {
        if (res.ok && res.status === 200) {
            return res.json();
        }
    });
};

export const changePassword = ({ token, newPassword }) => {
    return fetch(`${BASE_URL}/api/users/changepassword/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
    }).then((res) => {
        if (res.ok && res.status === 200) {
            return res.json();
        }
    });
};
