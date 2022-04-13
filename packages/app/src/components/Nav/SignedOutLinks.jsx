import React from 'react';
import { NavLink } from 'react-router-dom';

const SignedOutLinks = () => {
    return (
        <>
            <li>
                <NavLink
                    to="/signup"
                    className={({ isActive }) => (isActive ? 'teal darken-1' : undefined)}
                >
                    Sign Up
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/signin"
                    className={({ isActive }) => (isActive ? 'teal darken-1' : undefined)}
                >
                    Sign In
                </NavLink>
            </li>
        </>
    );
};

export default SignedOutLinks;
