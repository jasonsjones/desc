import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import ForgotPasswordForm from '../components/ForgotPasswordForm/ForgotPasswordForm';

const ForgotPassword = () => {
    const authCtx = useAuthContext();

    if (authCtx.contextUser) {
        return <Navigate to="/" />;
    }

    return <ForgotPasswordForm />;
};

export default ForgotPassword;
