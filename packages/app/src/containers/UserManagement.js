import React, { useContext, useEffect, useState } from 'react';
import M from 'materialize-css';
import AuthContext from '../context/AuthContext';
import useAllUsers from '../hooks/useAllUsers';

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

const UserRecord = ({ user, handleChangeUserStatus }) => {
    const authCtx = useContext(AuthContext);
    const { firstName, lastName, email, program, isEmailVerified, lastLoginAt, isActive } = user;

    function handleChange() {
        handleChangeUserStatus(user);
    }

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
                    <div className="switch">
                        <label className="grey-text text-darken-2">
                            Inactive
                            <input
                                type="checkbox"
                                data-target="modal"
                                className="modal-trigger"
                                checked={isActive}
                                disabled={authCtx.contextUser.id === user.id}
                                onChange={handleChange}
                            />
                            <span className="lever"></span>
                            Active
                        </label>
                    </div>
                </td>
            </tr>
        </>
    );
};

const UserManagement = () => {
    const authCtx = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [userToChangeStatus, setUserToChangeStatus] = useState(null);

    const { isLoading } = useAllUsers((response) => {
        if (response.success) {
            setUsers(response.payload.users);
        }
    });

    function handleChangeUserStatus(user) {
        if (authCtx.contextUser.id !== user.id) {
            setUserToChangeStatus(user);
        } else {
            setUserToChangeStatus(null);
        }
    }

    function handleChangeStatus() {
        const updatedUsers = users.map((user) => {
            if (user.id === userToChangeStatus.id) {
                user.isActive = !user.isActive;
            }
            return user;
        });
        setUsers(updatedUsers);

        const instance = M.Modal.getInstance(document.querySelector('.modal'));
        instance.close();
    }

    useEffect(() => {
        const elems = document.querySelectorAll('.modal');
        M.Modal.init(elems);
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
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading &&
                        users.length > 0 &&
                        users.map((user) => (
                            <UserRecord
                                key={user.id}
                                user={user}
                                handleChangeUserStatus={handleChangeUserStatus}
                            />
                        ))}
                </tbody>
            </table>

            <div className="show-on-medium-and-down hide-on-med-and-up">
                <div className="row">
                    {!isLoading &&
                        users.length > 0 &&
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
                        {`${
                            userToChangeStatus && userToChangeStatus.isActive
                                ? 'Deactivate'
                                : 'Activate'
                        } ${userToChangeStatus ? userToChangeStatus.firstName : 'User'} ${
                            userToChangeStatus ? userToChangeStatus.lastName : ''
                        }`}
                    </h4>
                    <p>Are you sure you would like to change the status of this user?</p>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-teal btn-flat">Cancel</button>
                    <button
                        className="waves-effect waves-red btn-flat"
                        onClick={handleChangeStatus}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </>
    );
};

export default UserManagement;
