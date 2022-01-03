import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useAuthContext } from '../../contexts/AuthContext';
import useLogin from '../../hooks/useLogin';

function SignInForm() {
    const authCtx = useAuthContext();
    const navigate = useNavigate();

    const [form, setValues] = useState({
        email: '',
        password: '',
        errorMsg: ''
    });

    const { mutate: doLogin, isLoading } = useLogin((data) => {
        if (data.success && data.payload) {
            const { user, accessToken: token } = data.payload;
            authCtx.login(user, token);
            navigate('/');
        } else {
            if (data.message === 'unauthorized') {
                setValues({
                    email: '',
                    password: '',
                    errorMsg: 'Unathorized user. Please try again'
                });
            }
        }
    });

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setValues({
            ...form,
            errorMsg: '',
            [event.target.id]: event.target.value
        });
    };

    const isFormValid = (): boolean => {
        return form.email.length > 0 && form.password.length > 0;
    };

    const handleSubmit: React.FormEventHandler = (event) => {
        event.preventDefault();
        if (isFormValid()) {
            const creds = {
                email: form.email,
                password: form.password
            };
            doLogin(creds);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <Paper elevation={2} sx={{ paddingBlockStart: '2.5rem' }}>
            <Typography variant="h4" component="h2" align="center">
                Sign in to Account
            </Typography>
            <form
                onSubmit={handleSubmit}
                style={{ padding: '2rem', maxWidth: '670px', margin: '0 auto' }}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Email sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                    <TextField
                        id="email"
                        label="Email"
                        variant="standard"
                        fullWidth={true}
                        onChange={handleChange}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', marginBlockStart: '1.5rem' }}>
                    <Lock sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth={true}
                        variant="standard"
                        onChange={handleChange}
                    />
                </Box>
                <Box
                    marginTop={4}
                    sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}
                >
                    <Button variant="outlined" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit">
                        {`${!isLoading ? 'Sign In' : 'Signing In...'}`}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}

export default SignInForm;
