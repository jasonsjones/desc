// import M from 'materialize-css';

const baseUrl = 'http://localhost:3001';

export const userLogin = creds => {
    return dispatch => {
        dispatch({ type: 'USER_LOGIN_REQUEST' });
        fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(creds),
            credentials: 'include'
        })
            .then(response => {
                if (response.ok && response.status === 200) {
                    return response.json();
                } else if (response.status === 401) {
                    return Promise.reject({ message: 'Unauthorized user' });
                }
            })
            .then(data => {
                if (data) {
                    window.localStorage.setItem('contextUser', JSON.stringify(data.payload.user));
                    window.localStorage.setItem('userToken', data.payload.token);
                    dispatch({ type: 'USER_LOGIN_SUCCESS', data });
                }
            })
            .catch(err => dispatch({ type: 'USER_LOGIN_ERROR', data: err.message }));
    };
};

export const userLogout = () => {
    return dispatch => {
        dispatch({ type: 'USER_LOGOUT_REQUEST' });
        fetch(`${baseUrl}/api/auth/logout`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.localStorage.removeItem('contextUser');
                    window.localStorage.removeItem('userToken');
                    dispatch({ type: 'USER_LOGOUT_SUCCESS' });
                }
            });
    };
};

export const userSignup = userData => {
    return dispatch => {
        dispatch({ type: 'USER_SIGNUP_REQUEST' });
        fetch(`${baseUrl}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                if (data) {
                    window.localStorage.setItem('contextUser', JSON.stringify(data.payload.user));
                    window.localStorage.setItem('userToken', data.payload.token);
                    dispatch({ type: 'USER_SIGNUP_SUCCESS', data });
                }
            })
            .catch(err => console.log(err));
    };
};

export const fetchData = () => {
    return dispatch => {
        dispatch({ type: 'FETCH_DATA_REQUEST' });
        fetch(`${baseUrl}/api`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                if (data) {
                    dispatch({ type: 'FETCH_DATA_SUCCESS', data });
                }
            })
            .catch(err => console.log(err));
    };
};

export const fetchItems = token => {
    return dispatch => {
        dispatch({ type: 'FETCH_ITEM_REQUEST' });

        fetch(`${baseUrl}/api/items`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                if (data) {
                    dispatch({ type: 'FETCH_ITEM_SUCCESS', data: data.payload.items });
                }
            })
            .catch(err => console.log(err));
    };
};

export const updateItemStatus = (itemStatusData, token) => {
    return dispatch => {
        dispatch({ type: 'UPDATE_ITEM_REQUEST_STATUS' });
        fetch(`${baseUrl}/api/items/${itemStatusData.itemId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(itemStatusData.requestBody),
            credentials: 'include'
        })
            .then(function(response) {
                console.log(response);
                if (response.ok && response.status === 200) {
                    return response.json();
                } else {
                    return Promise.reject({ message: 'err' });
                }
            })
            .then(function(data) {
                if (data.success) {
                    //   M.toast({ html: "Item status updated" });
                } else {
                }
                console.log(data);
            })
            .catch(function(err) {
                console.log(err);
            });
    };
};

export const postNoteToItem = (noteData, token) => {
    return dispatch => {
        dispatch({ type: 'POST_NOTE_TO_ITEM' });
        fetch(`${baseUrl}/api/items/${noteData.itemId}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(noteData.requestBody),
            credentials: 'include'
        })
            .then(function(response) {
                console.log(response);
                if (response.ok && response.status === 200) {
                    return response.json();
                } else {
                    return Promise.reject({ message: 'err' });
                }
            })
            .then(function(data) {
                if (data.success) {
                    //   M.toast({ html: "Note posted" });
                } else {
                }
                console.log(data);
            })
            .catch(function(err) {
                console.log(err);
            });
    };
};
