import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import M from 'materialize-css';

const UserDropdwon = ({ user, handleLogout, targetName }) => {
    const isAdmin = user.roles.includes('admin');

    useEffect(() => {
        const elems = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(elems, {
            coverTrigger: false
        });
    }, []);

    return (
        <>
            <li className="profile-menu">
                <a href="#!" className="dropdown-trigger" data-target={targetName}>
                    <i style={{ marginLeft: '10px' }} className="small material-icons prefix">
                        account_circle
                    </i>
                    <span style={{ margin: '0 8px' }}>
                        {`${user.name.first} ${user.name.last}`}
                    </span>
                    <i className={`small material-icons prefix`}>expand_more</i>
                </a>
            </li>
            <div>
                <ul id={targetName} className="dropdown-content">
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                    {isAdmin && (
                        <li>
                            <Link to="/usermanagement">User Management</Link>
                        </li>
                    )}
                    <li>
                        <Link to="/" onClick={handleLogout}>
                            Logout
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default UserDropdwon;
