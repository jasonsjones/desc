import React, { useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';

function SignInForm() {
    const [form, setValues] = useState({
        email: '',
        password: '',
        errorMsg: ''
    });

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setValues({
            ...form,
            errorMsg: '',
            [event.target.id]: event.target.value
        });
    };

    const handleSubmit: React.FormEventHandler = (event) => {
        event.preventDefault();
        console.log('Submitting form...');
        console.log(form);
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
                <Box mt={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <Button variant="outlined">Cancel</Button>
                    <Button variant="contained" type="submit">
                        Sign In
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}

export default SignInForm;
