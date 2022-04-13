import React, { useState } from 'react';
import UserProfileDetails from '../components/UserProfileDetails';
import EditProfile from '../components/EditProfile';
import { useAuthContext } from '../context/AuthContext';

const UserProfile = () => {
    const authCtx = useAuthContext();
    const [isEditMode, setIsEditMode] = useState(false);

    function handleEditClick(evt) {
        setIsEditMode(true);
    }

    return (
        <React.Fragment>
            <div className="row" style={{ marginTop: '3rem' }}>
                <div className="col s12 offset-m6">
                    <button
                        className="waves-effect waves-teal btn-flat"
                        onClick={handleEditClick}
                        style={{ visibility: `${isEditMode ? 'hidden' : 'visible'}` }}
                    >
                        <i className="material-icons left">edit</i>Edit Profile
                    </button>
                </div>
            </div>
            {!isEditMode ? (
                <UserProfileDetails user={authCtx.contextUser} />
            ) : (
                <EditProfile user={authCtx.contextUser} onUpdate={() => setIsEditMode(false)} />
            )}
        </React.Fragment>
    );
};

export default UserProfile;
