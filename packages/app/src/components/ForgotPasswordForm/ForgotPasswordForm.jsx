import M from 'materialize-css';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../Common/TextField';
import useForgotPassword from '../../hooks/useForgotPassword';

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

    cancelButton: {
        backgroundColor: 'white',
        color: 'teal',
        marginRight: '1rem'
    },

    message: {
        marginTop: '2rem',
        fontSize: '1.25rem'
    }
};

const ForgotPasswordForm = () => {
    const navigate = useNavigate();
    const textFieldRef = useRef();

    const [isRequestSent, setIsRequestSent] = useState(false);
    const [confirmedEmailAddress, setConfirmedEmailAddress] = useState('');
    const [userEmailAddress, setUserEmailAddress] = useState('');
    const [error, setError] = useState('');

    const { mutate: forgotPassword } = useForgotPassword(
        (response) => {
            if (response.success) {
                setConfirmedEmailAddress(response.payload.email);
                setIsRequestSent(true);
            } else {
                setError('Something went wrong. Please try again.');
            }
        },
        () => {
            setError('Something went wrong. Please try again.');
        }
    );

    useEffect(() => {
        setUserEmailAddress((v) => '');
        setTimeout(() => {
            M.updateTextFields();
            if (textFieldRef.current) {
                textFieldRef.current.classList.remove('valid');
            }
        }, 250);
    }, [confirmedEmailAddress]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userEmailAddress.length > 0) {
            forgotPassword(userEmailAddress);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    const handleChange = (e) => {
        setUserEmailAddress(e.target.value);
    };

    return (
        <div className="card-panel" style={css.formContainer}>
            <h4 className="center-align teal-text text-darken-3">Reset Password</h4>
            <p className="grey-text text-darken-1" style={{ fontSize: '1.25rem' }}>
                Enter the email address associated with your account and we'll send you a link to
                reset your password.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col s12">
                        <TextField
                            ref={textFieldRef}
                            label="Your Email"
                            icon="email"
                            type="text"
                            name="email"
                            value={userEmailAddress}
                            handleChange={handleChange}
                            validate
                        />
                    </div>
                </div>
                <div className="row">
                    {error.length > 0 && (
                        <p className="red-text" style={css.errorText} data-testid="error-message">
                            {error}
                        </p>
                    )}
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
                        <button
                            className="waves-effect waves-light btn"
                            type="submit"
                            data-testid="submit-btn"
                        >
                            Reset Password
                        </button>
                    </div>
                </div>
            </form>
            {isRequestSent && (
                <p
                    className="teal-text text-darken-3"
                    style={css.message}
                    data-testid="success-message"
                >
                    Thank you. An email has been sent to <em>{`${confirmedEmailAddress}`}</em> with
                    instructions to reset your password.
                </p>
            )}
        </div>
    );
};

export default ForgotPasswordForm;
