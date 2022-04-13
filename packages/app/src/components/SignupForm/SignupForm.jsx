import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import M from 'materialize-css';
import TextField from '../Common/TextField';
import useSignup from '../../hooks/useSignup';

const css = {
    formContainer: {
        padding: '1.5rem 2rem',
        maxWidth: '670px',
        margin: '2.5rem auto 0'
    },

    cancelButton: {
        backgroundColor: 'white',
        color: 'teal',
        marginRight: '1rem'
    }
};

const SignupForm = ({ onRegister }) => {
    const navigate = useNavigate();

    const [form, setValues] = useState({
        firstName: '',
        lastNameDesktop: '',
        lastNameMobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        program: ''
    });
    const [error, setError] = useState(null);

    const { mutate: doSignup, isLoading } = useSignup((data) => {
        if (data.success) {
            onRegister();
        }
    });

    useEffect(() => {
        if (form.confirmPassword.length > 0 && form.password !== form.confirmPassword) {
            setError('Passwords do NOT match');
        }
        if (form.confirmPassword.length > 0 && form.password === form.confirmPassword) {
            setError(null);
        }
    }, [form]);

    useEffect(() => {
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }, []);

    const handleChange = (e) => {
        setValues({
            ...form,
            [e.target.id]: e.target.value
        });
    };

    const isFormValid = () => {
        return (
            form.firstName.length > 0 &&
            (form.lastNameDesktop.length > 0 || form.lastNameMobile > 0) &&
            form.email.length > 0 &&
            form.password.length > 0 &&
            form.program.length > 0 &&
            form.password === form.confirmPassword
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid()) {
            const payload = {
                firstName: form.firstName,
                lastName: form.lastNameDesktop || form.lastNameMobile,
                email: form.email,
                password: form.password,
                program: form.program
            };

            doSignup(payload);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="card-panel" style={css.formContainer}>
            <h4 className="center-align teal-text text-darken-3">Register for Account</h4>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col s12 m6">
                        <TextField
                            label="First Name"
                            icon="account_circle"
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            handleChange={handleChange}
                        />
                    </div>
                    <div className="col s12 m6 hide-on-med-and-up">
                        <TextField
                            data-testid="last-name-mobile"
                            label="Last Name"
                            icon="account_circle"
                            type="text"
                            name="lastNameMobile"
                            value={form.lastName}
                            handleChange={handleChange}
                        />
                    </div>
                    <div className="col s12 m6 hide-on-small-only">
                        <TextField
                            data-testid="last-name-desktop"
                            label="Last Name"
                            type="text"
                            name="lastNameDesktop"
                            value={form.lastName}
                            handleChange={handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <TextField
                            label="Your Email"
                            icon="email"
                            type="text"
                            name="email"
                            value={form.email}
                            handleChange={handleChange}
                            validate
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <i className="small material-icons prefix">domain</i>
                        <select defaultValue="default" id="program" onChange={handleChange}>
                            <option value="default" disabled>
                                Select your program
                            </option>
                            <option value="housing first">Housing First</option>
                            <option value="integrated services">Integrated Services</option>
                            <option value="survival services">Survival Services</option>
                            <option value="health services">Health Services</option>
                            <option value="employment services">Employment Services</option>
                            <option value="research_innovation">Research &amp; Innovation</option>
                        </select>
                        <label htmlFor="program">Program</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <TextField
                            label="Password"
                            icon="lock"
                            type="password"
                            name="password"
                            value={form.password}
                            handleChange={handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <TextField
                            label="Confirm Password"
                            icon="lock"
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            error={error}
                            handleChange={handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col right">
                        <button
                            className="btn"
                            type="button"
                            onClick={handleCancel}
                            style={css.cancelButton}
                        >
                            Cancel
                        </button>
                        <button className="waves-effect waves-light btn" type="submit">
                            {`${!isLoading ? 'Sign Up' : 'Signing up...'}`}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SignupForm;
