import { Email, Lock } from '@mui/icons-material';
import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useLogin } from '../../hooks';

function LoginForm() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: '',
        errorMsg: ''
    });

    const handleLoginError = () => {
        setForm({
            email: '',
            password: '',
            errorMsg: 'Unathorized user. Please try again'
        });
    };

    const handleLoginSuccess = () => {
        navigate('/');
    };

    const { mutate: login, isLoading } = useLogin(handleLoginSuccess, handleLoginError);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setForm({
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
            login(creds);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <Paper elevation={2} sx={{ paddingBlockStart: '2.5rem' }}>
            <Typography variant="h4" component="h2" align="center">
                Login to Account
            </Typography>
            <form
                onSubmit={handleSubmit}
                style={{ padding: '2rem', maxWidth: '670px', margin: '0 auto' }}
            >
                <Stack direction="row" alignItems="flex-end">
                    <Email sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                    <TextField
                        id="email"
                        label="Email"
                        variant="standard"
                        fullWidth={true}
                        onChange={handleChange}
                        value={form.email}
                    />
                </Stack>
                <Stack mt={4} direction="row" alignItems="flex-end">
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
                </Stack>
                {form.errorMsg ? (
                    <Box mt={4}>
                        <Alert severity="error" variant="outlined">
                            {form.errorMsg}
                        </Alert>
                    </Box>
                ) : null}
                <Stack mt={4} spacing={2} direction="row" justifyContent="flex-end">
                    <Button variant="outlined" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit">
                        {`${!isLoading ? 'Log In' : 'Logging In...'}`}
                    </Button>
                </Stack>
                <Box marginLeft={4}>
                    <Link to="/" component={RouterLink} underline="none">
                        Forgot Password?
                    </Link>
                </Box>
            </form>
        </Paper>
    );
}

export default LoginForm;
