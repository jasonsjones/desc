import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

const UserCard = ({ user }) => {
    const { firstName, lastName, email, program, isEmailVerified, lastLoginAt } = user;
    return (
        <div className="card-panel grey lighten-4">
            <h3 className="center">
                {firstName} {lastName}
            </h3>
            <p className="flow-text">{email}</p>
            <p className="flow-text">{program.toUpperCase()}</p>
            <p className="flow-text valign-wrapper">
                Email Verified:
                {isEmailVerified ? (
                    <i className="small material-icons prefix">check</i>
                ) : (
                    <i className="small material-icons prefix">clear</i>
                )}
            </p>
            <p className="flow-text">Last Login: {new Date(lastLoginAt).toDateString()}</p>
            <button className="waves-effect waves-light btn red darken-2">
                <i className="material-icons left">delete</i>Remove
            </button>
        </div>
    );
};

const User = ({ user }) => {
    const { firstName, lastName, email, program, isEmailVerified, lastLoginAt } = user;
    return (
        <>
            <tr>
                <td>
                    {firstName} {lastName}
                </td>
                <td>{email}</td>
                <td style={{ textTransform: 'capitalize' }}>{program}</td>
                <td>
                    {isEmailVerified ? (
                        <i className="small material-icons prefix">check</i>
                    ) : (
                        <i className="small material-icons prefix">clear</i>
                    )}
                </td>
                <td>{new Date(lastLoginAt).toDateString()}</td>
                <td>
                    <span style={{ cursor: 'pointer' }}>
                        <i className="small material-icons prefix">delete</i>
                    </span>
                </td>
            </tr>
        </>
    );
};

const UserManagement = () => {
    const authCtx = useContext(AuthContext);
    const [users, setUsers] = useState({});

    useEffect(() => {
        fetch('http://localhost:3001/api/users', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${authCtx.token}`
            }
        })
            .then((res) => res.json())
            .then((data) => setUsers(data.payload.users));
    }, []);

    return (
        <>
            <h3 className="center-align teal-text">User Management</h3>
            <table className="highlight hide-on-med-and-down">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Program</th>
                        <th>Email Verified</th>
                        <th>Last Login</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 && users.map((user) => <User key={user.id} user={user} />)}
                </tbody>
            </table>

            <div className="show-on-medium-and-down hide-on-med-and-up">
                <div className="row">
                    {users.length > 0 &&
                        users.map((user) => (
                            <div key={user.id} className="col s12 l4">
                                <UserCard user={user} />
                            </div>
                        ))}
                </div>
            </div>

            <div id="modal" className="modal">
                <div className="modal-content">
                    <h4>Delete User?</h4>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-close>">
                        Confirm
                    </a>
                </div>
            </div>
        </>
    );
};

export default UserManagement;
