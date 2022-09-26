import { AccountCircle, Domain, Email, Lock } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
    const navigate = useNavigate();

    const [form, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        program: '',
        password: '',
        confirmPassword: '',
        errorMsg: ''
    });

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setValues({
            ...form,
            errorMsg: '',
            [event.target.id]: event.target.value
        });
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        setValues({
            ...form,
            errorMsg: '',
            program: event.target.value
        });
    };

    const isFormValid = (): boolean => {
        // TODO: update logic to verify form data
        return form.email.length > 0 && form.password.length > 0;
    };

    const handleSubmit: React.FormEventHandler = (event) => {
        event.preventDefault();
        if (isFormValid()) {
            // TODO: submit form data (useRegisterUser hook, mabye?)
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <Paper elevation={2} sx={{ paddingBlockStart: '2.5rem' }}>
            <Typography variant="h4" component="h2" align="center">
                Register for Account
            </Typography>
            <form
                onSubmit={handleSubmit}
                style={{ padding: '2rem', maxWidth: '670px', margin: '0 auto' }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Stack direction="row" alignItems="flex-end">
                            <AccountCircle sx={{ color: 'action.active', mr: 1 }} />
                            <TextField
                                id="firstName"
                                label="First Name"
                                variant="standard"
                                fullWidth={true}
                                onChange={handleChange}
                                value={form.firstName}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack direction="row" alignItems="flex-end">
                            <AccountCircle
                                sx={{
                                    color: 'action.active',
                                    mr: 1,
                                    display: { xs: 'block', md: 'none' }
                                }}
                            />
                            <TextField
                                id="lastName"
                                label="Last Name"
                                variant="standard"
                                fullWidth={true}
                                onChange={handleChange}
                                value={form.lastName}
                            />
                        </Stack>
                    </Grid>
                </Grid>
                <Stack mt={4} direction="row" alignItems="flex-end">
                    <Email sx={{ color: 'action.active', mr: 1 }} />
                    <TextField
                        id="email"
                        label="Your Email"
                        variant="standard"
                        fullWidth={true}
                        onChange={handleChange}
                        value={form.email}
                    />
                </Stack>
                <Stack mt={4} direction="row" alignItems="flex-end">
                    <Domain sx={{ color: 'action.active', mr: 1 }} />
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="program-label">Program</InputLabel>
                        <Select
                            labelId="program-label"
                            id="program"
                            value={form.program}
                            onChange={handleSelectChange}
                            label="Program"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="housing first">Housing First</MenuItem>
                            <MenuItem value="integrated services">Integrated Services</MenuItem>
                            <MenuItem value="survival services">Survival Services</MenuItem>
                            <MenuItem value="health services">Health Services</MenuItem>
                            <MenuItem value="employment services">Employment Services</MenuItem>
                            <MenuItem value="research innovation">
                                Research &amp; Innovation
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
                <Stack mt={4} direction="row" alignItems="flex-end">
                    <Lock sx={{ color: 'action.active', mr: 1 }} />
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
                <Stack mt={4} direction="row" alignItems="flex-end">
                    <Lock sx={{ color: 'action.active', mr: 1 }} />
                    <TextField
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        fullWidth={true}
                        variant="standard"
                        onChange={handleChange}
                        value={form.confirmPassword}
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
                        Register
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
}

export default RegisterForm;
