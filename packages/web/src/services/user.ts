import { RegisterUserData } from '../common/userTypes';
import { BASE_URL } from './util';

export async function register(userData: RegisterUserData) {
    const res = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });

    if (!res.ok) {
        const cause = await res.json();
        throw new Error(res.statusText, { cause });
    }

    return await res.json();
}
