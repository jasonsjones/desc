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
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterUser } from '../../hooks';

const programData = [
    {
        value: 'HOUSING_FIRST',
        displayValue: 'Housing First'
    },
    {
        value: 'INTEGRATED_SERVICES',
        displayValue: 'Integrated Services'
    },
    {
        value: 'SURVIVAL_SERVICES',
        displayValue: 'Survival Services'
    },
    {
        value: 'HEALTH_SERVICES',
        displayValue: 'Health Services'
    },
    {
        value: 'EMPLOYMENT_SERVICES',
        displayValue: 'Employment Services'
    },
    {
        value: 'RESEARCH_INNOVATION',
        displayValue: 'Research & Innovation'
    }
];

const defaultFormState = {
    firstName: '',
    lastName: '',
    email: '',
    program: '',
    password: '',
    confirmPassword: ''
};

function RegisterForm() {
    const navigate = useNavigate();

    const [form, setForm] = useState(defaultFormState);

    const [passwordsNoMatch, setPasswordsNoMatch] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRegisterSuccess = () => {
        setForm(defaultFormState);
        setError(null);
        navigate('/');
    };

    const handleRegisterError = () => {
        setError('Oops, something went wrong.  Please try again.');
    };

    const { mutate: doRegister, isLoading } = useRegisterUser(
        handleRegisterSuccess,
        handleRegisterError
    );

    useEffect(() => {
        if (form.confirmPassword.length > 0 && form.password !== form.confirmPassword) {
            setPasswordsNoMatch('Passwords do NOT match');
        }
        if (form.confirmPassword.length > 0 && form.password === form.confirmPassword) {
            setPasswordsNoMatch(null);
        }
    }, [form]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value
        });
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        setForm({
            ...form,
            program: event.target.value
        });
    };

    const isFormValid = (): boolean => {
        // TODO: update logic to verify form data
        return (
            form.firstName.length > 0 &&
            form.lastName.length > 0 &&
            form.email.length > 0 &&
            form.password.length > 0 &&
            form.program.length > 0 &&
            form.password === form.confirmPassword
        );
    };

    const handleSubmit: React.FormEventHandler = (event) => {
        event.preventDefault();
        if (isFormValid()) {
            const { confirmPassword, ...registerData } = form;
            doRegister(registerData);
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
                                required
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
                                required
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
                        required
                    />
                </Stack>
                <Stack mt={4} direction="row" alignItems="flex-end">
                    <Domain sx={{ color: 'action.active', mr: 1 }} />
                    <FormControl required variant="standard" fullWidth>
                        <InputLabel id="program-label">Program</InputLabel>
                        <Select
                            labelId="program-label"
                            id="program"
                            value={form.program}
                            onChange={handleSelectChange}
                            label="Program"
                        >
                            {programData.map((program, idx) => (
                                <MenuItem key={idx} value={program.value}>
                                    {program.displayValue}
                                </MenuItem>
                            ))}
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
                        required
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
                        helperText={passwordsNoMatch}
                    />
                </Stack>
                {error ? (
                    <Box mt={4}>
                        <Alert severity="error" variant="outlined">
                            {error}
                        </Alert>
                    </Box>
                ) : null}
                <Stack mt={4} spacing={2} direction="row" justifyContent="flex-end">
                    <Button variant="outlined" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit">
                        {isLoading ? 'Registering' : 'Register'}
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
}

export default RegisterForm;
