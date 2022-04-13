import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';
import { useAuthContext } from '../../context/AuthContext';
import TextField from '../Common/TextField';
import useLogin from '../../hooks/useLogin';

const css = {
    formContainer: {
        padding: '1.5rem 2rem',
        maxWidth: '670px',
        margin: '2.5rem auto 0'
    },

    errorText: {
        padding: '0 4rem',
        fontSize: '1rem'
    },

    forgotPassword: {
        padding: '0 4rem',
        fontSize: '1rem'
    },

    cancelButton: {
        backgroundColor: 'white',
        color: 'teal',
        marginRight: '1rem'
    }
};

const SigninForm = () => {
    const authCtx = useAuthContext();
    const navigate = useNavigate();

    const [form, setValues] = useState({
        email: '',
        password: '',
        errorMsg: ''
    });

    const { mutate: doLogin, isLoading } = useLogin((data) => {
        if (data.success) {
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
            M.updateTextFields();
        }
    });

    const handleChange = (e) => {
        setValues({
            ...form,
            errorMsg: '',
            [e.target.id]: e.target.value
        });
    };

    const isFormValid = () => {
        return form.email.length > 0 && form.password.length > 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
        <div className="card-panel" style={css.formContainer}>
            <h4 className="center-align teal-text text-darken-3">Sign In to Account</h4>
            <form onSubmit={handleSubmit}>
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
                {form.errorMsg.length > 0 && (
                    <div className="row">
                        <p className="red-text" style={css.errorText}>
                            {form.errorMsg}
                        </p>
                    </div>
                )}
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
                            {`${!isLoading ? 'Sign In' : 'Signing In...'}`}
                        </button>
                    </div>
                </div>
                <div className="row">
                    <Link to="/forgotpassword" className="teal-text" style={css.forgotPassword}>
                        Forgot Password?
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default SigninForm;
