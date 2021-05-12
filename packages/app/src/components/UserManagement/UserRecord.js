import React from 'react';

function UserRecord({ user }) {
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
                    <button
                        data-target="modal"
                        className="waves-effect waves-red btn-flat modal-trigger"
                    >
                        <i className="small material-icons prefix">delete</i>
                    </button>
                </td>
            </tr>
        </>
    );
}

export default UserRecord;
