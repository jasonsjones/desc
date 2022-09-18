import { Email, Lock } from '@mui/icons-material';
import { Alert, Box, Button, Link, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthTokenResponse } from '../../common/apiResponseTypes';
import { useAuthContext } from '../../contexts/AuthContext';
import { useLogin } from '../../hooks';

function SignInForm() {
    const authCtx = useAuthContext();
    const navigate = useNavigate();

    const [form, setValues] = useState({
        email: '',
        password: '',
        errorMsg: ''
    });

    const handleSuccess = (data: AuthTokenResponse) => {
        if (data?.access_token && data?.user) {
            const { user, access_token: token } = data;
            authCtx.login(user, token);
            navigate('/');
        } else {
            if (!data?.access_token && data?.message === 'unauthorized') {
                setValues({
                    email: '',
                    password: '',
                    errorMsg: 'Unathorized user. Please try again'
                });
            }
        }
    };

    const { mutate: doLogin, isLoading } = useLogin(handleSuccess);

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
                        value={form.email}
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
                        value={form.password}
                    />
                </Box>
                {form.errorMsg ? (
                    <Box mt={4}>
                        <Alert severity="error" variant="outlined">
                            {form.errorMsg}
                        </Alert>
                    </Box>
                ) : null}
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
                <Box marginLeft={4}>
                    <Link to="/" component={RouterLink} underline="none">
                        Forgot Password?
                    </Link>
                </Box>
            </form>
        </Paper>
    );
}

export default SignInForm;
