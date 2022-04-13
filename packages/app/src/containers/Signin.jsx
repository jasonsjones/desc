import React from 'react';
import { Navigate } from 'react-router-dom';
import SigninForm from '../components/SigninForm/SigninForm';
import { useAuthContext } from '../context/AuthContext';

const Signin = () => {
    const authCtx = useAuthContext();
    if (authCtx.contextUser) {
        return <Navigate to="/" />;
    }
    return <SigninForm />;
};

export default Signin;
