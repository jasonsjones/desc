import { BASE_URL } from './util';

export const signup = userData => {
    return fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    }).then(res => {
        if (res.ok && res.status === 201) {
            return res.json();
        }
    });
};
