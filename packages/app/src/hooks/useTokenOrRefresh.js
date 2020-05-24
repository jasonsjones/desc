import { useContext, useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import AuthContext from '../context/AuthContext';
import { BASE_URL } from '../services/util';

const useTokenOrUpdate = () => {
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

export default useTokenOrUpdate;
