import React from 'react';
import { NavLink } from 'react-router-dom';

const SignedInLinks = () => {
    return (
        <>
            <li>
                <NavLink to="/create">Create Request</NavLink>
            </li>
            <li>
                <NavLink to="/inbox">View Requests</NavLink>
            </li>
        </>
    );
};

export default SignedInLinks;
