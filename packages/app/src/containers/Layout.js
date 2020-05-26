import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav/Nav';
import { AuthProvider } from '../context/AuthContext';
import { fetchSessionUser, getRefreshToken } from '../services/auth';
import { useInterval } from '../hooks';

const Layout = props => {
    const [contextUser, setContextUser] = useState(null);
    const [token, setToken] = useState('');
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        fetchSessionUser().then(data => {
            if (data && data.payload) {
                setContextUser(data.payload.user);
                setToken(data.payload.accessToken);
            }

            setTimeout(() => {
                setIsFetching(false);
            }, 1000);
        });
    }, []);

    useInterval(() => {
        if (token) {
            getRefreshToken(token).then(data => {
                if (data.payload && data.payload.accessToken) {
                    setToken(data.payload.accessToken);
                }
            });
        }
    }, 1000 * 60 * 12); // refresh token every 12 mins.

    const login = (user, token) => {
        setContextUser(user);
        setToken(token);
    };

    const logout = () => {
        setIsFetching(true);
        setContextUser(null);
        setToken('');

        setTimeout(() => {
            setIsFetching(false);
        }, 1000);
    };

    const updateToken = token => {
        setToken(token);
    };

    return (
        <React.Fragment>
            <AuthProvider value={{ contextUser, token, login, logout, updateToken }}>
                {isFetching ? (
                    <div style={{ position: 'absolute', left: '35%', top: '50%', width: '30%' }}>
                        <div className="progress">
                            <div className="indeterminate"></div>
                        </div>
                    </div>
                ) : (
                    <React.Fragment>
                        <header>
                            <Nav />
                        </header>
                        <main className="container">{props.children}</main>
                        <footer className="page-footer teal">
                            <div className="container"></div>
                            <div className="footer-copyright">
                                <div className="container center-align">
                                    © 2020 &bull; All Rights Reserved &bull; Downtown Emergency
                                    Service Center{' '}
                                </div>
                            </div>
                        </footer>
                    </React.Fragment>
                )}
            </AuthProvider>
        </React.Fragment>
    );
};

export default Layout;
