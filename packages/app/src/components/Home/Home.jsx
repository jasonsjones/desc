import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import team from './team_success.svg';

const Home = () => {
    const authCtx = useAuthContext();
    return (
        <>
            {!authCtx.isFetchingToken && authCtx.contextUser ? (
                <h3 className="center-align teal-text">
                    Welcome, {`${authCtx.contextUser.name.first}`}
                </h3>
            ) : (
                <>
                    <h1 className="teal-text text-darken-2">Welcome to the DESC Portal!</h1>
                    <div className="row">
                        <div className="col s12 l6">
                            <h4 className="blue-grey-text text-darken-2">
                                A place to meet the needs of DESC's clients
                            </h4>
                            <ul className="browser-default blue-grey-text text-darken-1">
                                <li className="flow-text">Request various items</li>
                                <li className="flow-text">Approve requests</li>
                                <li className="flow-text">Verify status of requests</li>
                                <li className="flow-text">Make notes on requests</li>
                            </ul>
                        </div>
                        <div className="col s12 l6 center">
                            <img src={team} alt="team success" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12 l6 center">
                            <div className="card-panel grey lighten-3">
                                <p className="flow-text">
                                    No account? Head on over to the sign up page and register for an
                                    account. It's super easy.
                                </p>
                                <Link to="/signup" className="waves-effect waves-light btn-large">
                                    <i className="material-icons left">person_add</i>Register
                                </Link>
                            </div>
                        </div>
                        <div className="col s12 l6 center">
                            <div className="card-panel grey lighten-3">
                                <p className="flow-text">
                                    Have an account? Login to make a new request or view the status
                                    of an existing one.
                                </p>
                                <Link to="/signin" className="waves-effect waves-light btn-large">
                                    <i className="material-icons left">exit_to_app</i>Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Home;
