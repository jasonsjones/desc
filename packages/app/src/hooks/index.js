import { useCallback, useContext, useState, useEffect, useRef } from 'react';
import jwt from 'jsonwebtoken';
import AuthContext from '../context/AuthContext';
import { BASE_URL } from '../services/util';

const useTokenOrRefresh = (runOnLoad = false) => {
    const authContext = useContext(AuthContext);
    const [token, setToken] = useState(authContext.token);
    const tokenExpiresRef = useRef();
    const nowRef = useRef();

    const getTokenOrRefresh = useCallback(() => {
        tokenExpiresRef.current = jwt.decode(token).exp;
        nowRef.current = Date.now().valueOf() / 1000;

        if (nowRef.current > tokenExpiresRef.current) {
            return fetch(`${BASE_URL}/api/auth/refreshtoken`, {
                method: 'GET',
                credentials: 'include'
            })
                .then(res => res.json())
                .then(data => {
                    if (data && data.payload) {
                        setToken(data.payload.accessToken);
                        authContext.updateToken(data.payload.accessToken);
                        console.log('refreshing token...');
                        console.log('old token: ', token);
                        console.log('new token: ', data.payload.accessToken);
                        return { token: data.payload.accessToken };
                    }
                });
        } else {
            return Promise.resolve({ token });
        }
    }, [authContext, token]);

    useEffect(() => {
        if (runOnLoad) {
            getTokenOrRefresh();
        }
    }, [getTokenOrRefresh, runOnLoad]);

    return { token, getTokenOrRefresh };
};

const useFetchData = (endpoint, options = {}) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const { token } = useTokenOrRefresh(true); // true = refresh on first component load

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${BASE_URL}${endpoint}`, {
                    ...options,
                    method: 'GET',
                    credentials: 'include',
                    headers: { Authorization: `Bearer ${token}` }
                });
                const json = await res.json();
                setResponse(json);
                setIsFetching(false);
            } catch (error) {
                console.log(error);
                setError(error);
                setIsFetching(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return { response, error, isFetching };
};

function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => {
                clearInterval(id);
            };
        }
    }, [delay]);
}

export { useFetchData, useTokenOrRefresh, useInterval };
