import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const AdminRoute = ({ component: Component, ...rest }) => {
    const authCtx = useAuthContext();
    const isAdmin = authCtx.contextUser && authCtx.contextUser.roles.includes('admin');
    return (
        <Route
            {...rest}
            render={(props) => (isAdmin ? <Component {...props} /> : <Redirect to="/" />)}
        />
    );
};

export default AdminRoute;
