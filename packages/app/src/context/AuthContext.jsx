import React, { useContext, useState } from 'react';
import useRefreshAccessToken from '../hooks/useRefreshAccessToken';

const AuthContext = React.createContext({
    contextUser: null,
    token: '', //jwt
    isFetchingToken: true,
    login: () => {},
    logout: () => {}
});

const AuthConsumer = AuthContext.Consumer;

function AuthProvider({ children }) {
    const [contextUser, setContextUser] = useState(null);
    const [token, setToken] = useState('');

    const { isLoading: isFetchingToken } = useRefreshAccessToken(12, (data) => {
        if (data && data.success && data.payload) {
            setContextUser(data.payload.user);
            setToken(data.payload.accessToken);
        }
    });

    const login = (user, token) => {
        setContextUser(user);
        setToken(token);
    };

    const logout = () => {
        setContextUser(null);
        setToken('');
    };

    const updateToken = (token) => {
        setToken(token);
    };

    const updateContextUser = (user) => {
        setContextUser(user);
    };

    return (
        <AuthContext.Provider
            value={{
                contextUser,
                token,
                isFetchingToken,
                login,
                logout,
                updateToken,
                updateContextUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

const useAuthContext = () => useContext(AuthContext);

export { AuthProvider, AuthConsumer, useAuthContext };
export default AuthContext;
