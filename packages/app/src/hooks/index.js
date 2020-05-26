import { useContext, useState, useEffect, useRef } from 'react';
import jwt from 'jsonwebtoken';
import AuthContext from '../context/AuthContext';
import { BASE_URL } from '../services/util';

const useTokenOrRefresh = () => {
    const authContext = useContext(AuthContext);
    const [token, setToken] = useState(authContext.token);
    const tokenExpires = jwt.decode(token).exp;
    const now = Date.now().valueOf() / 1000;

    useEffect(() => {
        const getNewToken = async () => {
            const res = await fetch(`${BASE_URL}/api/auth/refreshtoken`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            if (data && data.payload) {
                setToken(data.payload.accessToken);
                authContext.updateToken(data.payload.accessToken);
            }
        };
        if (now > tokenExpires) {
            getNewToken();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return token;
};

const useFetchData = (endpoint, options = {}) => {
    const authContext = useContext(AuthContext);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const token = authContext.token;

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
