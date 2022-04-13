import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const authCtx = useAuthContext();
    return authCtx.token ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
