import { useState, useEffect } from 'react';
import useTokenOrRefresh from './useTokenOrRefresh';

const useFetch = (url, options) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const token = useTokenOrRefresh();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(url, {
                    ...options,
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

export default useFetch;
