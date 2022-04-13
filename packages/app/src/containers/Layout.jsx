import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import { useAuthContext } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { isFetchingToken } = useAuthContext();

    return (
        <React.Fragment>
            {isFetchingToken ? (
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
                    <main className="container">
                        <Outlet />
                    </main>
                    <footer className="page-footer teal">
                        <div className="container"></div>
                        <div className="footer-copyright">
                            <div className="container center-align">
                                © 2020 &bull; All Rights Reserved &bull; Downtown Emergency Service
                                Center{' '}
                            </div>
                        </div>
                    </footer>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default Layout;
