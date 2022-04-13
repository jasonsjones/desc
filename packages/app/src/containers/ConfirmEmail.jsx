import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useConfirmEmail from '../hooks/useConfirmEmail';

const css = {
    container: {
        padding: '1.5rem 2rem',
        maxWidth: '670px',
        margin: '2.5rem auto'
    },

    secondary_text: {
        fontSize: '1.25rem'
    }
};

const ConfirmEmail = () => {
    const { token } = useParams();

    const { mutate: confirmEmail, isSuccess, isError } = useConfirmEmail();

    useEffect(() => {
        confirmEmail(token);
    }, [token, confirmEmail]);

    return (
        <div style={css.container}>
            {isSuccess && (
                <React.Fragment>
                    <h4 className="center-align teal-text text-darken-3">
                        Thank you for confirming your email
                    </h4>
                    <p className="grey-text text-darken-2" style={css.secondary_text}>
                        We appreciate you taking the time to confirm your email. It will greatly
                        assist us in the future should we need to send you any important
                        information.
                    </p>
                    <p className="grey-text text-darken-2" style={css.secondary_text}>
                        Feel free to <Link to="/signin">sign in</Link> to access your account.
                    </p>
                </React.Fragment>
            )}

            {isError && (
                <h5 className="center-align red-text text-darken-2">
                    Oops, looks like we were unable to confirm your email
                </h5>
            )}
        </div>
    );
};

export default ConfirmEmail;
