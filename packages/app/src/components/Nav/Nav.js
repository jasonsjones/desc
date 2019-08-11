import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import SignedOutLinks from './SignedOutLinks';
import SignedInLinks from './SignedInLinks';
import UserDropdown from './UserDropdown';
import AuthContext from '../../context/AuthContext';
import { logout } from '../../services/auth';
import './Nav.css';

const Nav = () => {
    const authCtx = useContext(AuthContext);
    const isAuthed = authCtx.contextUser && authCtx.token;

    const handleLogout = () => {
        logout().then(data => {
            if (data.success) {
                authCtx.logout();
            }
        });
    };

    return (
        <nav className="nav-wrapper teal">
            <div className="container">
                <Link to="/">
                    <span className="brand-logo">DESC Portal</span>
                </Link>
                <ul className="right hide-on-med-and-down">
                    {!isAuthed && <SignedOutLinks />}
                    {isAuthed && (
                        <>
                            <SignedInLinks />
                            <UserDropdown user={authCtx.contextUser} handleLogout={handleLogout} />
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Nav;