import { BASE_URL } from './util';

export const getItemsForUser = (userId, token) => {
    return fetch(`${BASE_URL}/api/items?submittedBy=${userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
    });
};

export const addNoteToItem = (itemId, postBody, token) => {
    return fetch(`${BASE_URL}/api/items/${itemId}/notes`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(postBody)
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
    });
};
