import React, { useContext, useEffect, useState } from 'react';
import M from 'materialize-css';
import AuthContext from '../context/AuthContext';

const UserCard = ({ user }) => {
    const { firstName, lastName, email, program, isEmailVerified, lastLoginAt } = user;
    return (
        <div className="card-panel grey lighten-4">
            <h3 className="center">
                {firstName} {lastName}
            </h3>
            <p className="flow-text">Email: {email}</p>
            <p className="flow-text" style={{ textTransform: 'capitalize' }}>
                Program: {program}
            </p>
            <p className="flow-text">
                Role(s):{' '}
                <span style={{ textTransform: 'capitalize' }}> {user.roles.join(', ')} </span>
            </p>
            <p className="flow-text valign-wrapper">
                Email Verified:
                {isEmailVerified ? (
                    <i className="small material-icons prefix green-text text-darken-1">check</i>
                ) : (
                    <i className="small material-icons prefix">clear</i>
                )}
            </p>
            <p className="flow-text">
                Last Login:{' '}
                {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
                    new Date(lastLoginAt)
                )}
            </p>
            <button
                data-target="modal"
                className="waves-effect waves-light btn red darken-2 modal-trigger"
            >
                <i className="material-icons left">delete</i>Remove
            </button>
        </div>
    );
};

const UserRecord = ({ user, handleUserToDelete }) => {
    const authCtx = useContext(AuthContext);
    const { firstName, lastName, email, program, isEmailVerified, lastLoginAt } = user;
    return (
        <>
            <tr>
                <td>
                    {firstName} {lastName}
                </td>
                <td>{email}</td>
                <td style={{ textTransform: 'capitalize' }}>{program}</td>
                <td style={{ textTransform: 'capitalize' }}>{user.roles.join(', ')}</td>
                <td>
                    {isEmailVerified ? (
                        <i className="small material-icons prefix green-text text-darken-1">
                            check
                        </i>
                    ) : (
                        <i className="small material-icons prefix">clear</i>
                    )}
                </td>
                <td>
                    {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
                        new Date(lastLoginAt)
                    )}
                </td>
                <td>
                    {authCtx.contextUser.id !== user.id ? (
                        <button
                            data-target="modal"
                            className="waves-effect waves-red btn-flat modal-trigger"
                            onClick={() => {
                                handleUserToDelete(user);
                            }}
                        >
                            <i className="small material-icons prefix">delete</i>
                        </button>
                    ) : (
                        <button className="waves-effect waves-red btn-flat disabled">
                            <i className="small material-icons prefix">clear</i>
                        </button>
                    )}
                </td>
            </tr>
        </>
    );
};

const UserManagement = () => {
    const authCtx = useContext(AuthContext);
    const [users, setUsers] = useState({});
    const [userToDelete, setUserToDelete] = useState(null);

    function handleUserToDelete(user) {
        if (authCtx.contextUser.id !== user.id) {
            setUserToDelete(user);
        } else {
            setUserToDelete(null);
        }
    }

    useEffect(() => {
        const elems = document.querySelectorAll('.modal');
        M.Modal.init(elems);

        fetch('http://localhost:3001/api/users', {
            method: 'GET',
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${authCtx.token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.payload.users) {
                    setUsers(data.payload.users);
                }
            });
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
                        <th>Role(s)</th>
                        <th>Email Verified</th>
                        <th>Last Login</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {users &&
                        users.length > 0 &&
                        users.map((user) => (
                            <UserRecord
                                key={user.id}
                                user={user}
                                handleUserToDelete={handleUserToDelete}
                            />
                        ))}
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
                    <h4>
                        {`Remove ${userToDelete ? userToDelete.firstName : 'User'} ${
                            userToDelete ? userToDelete.lastName : ''
                        }`}
                    </h4>
                    <p>
                        Are you sure you would like to remove this user? This action cannot be
                        undone.
                    </p>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-teal btn-flat">Cancel</button>
                    <button className="waves-effect waves-red btn-flat">Remove</button>
                </div>
            </div>
        </>
    );
};

export default UserManagement;
