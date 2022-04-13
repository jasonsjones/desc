import React from 'react';
import avatar from './default_avatar.png';

const avatarBgColor = '#e0f1f2';

const programMap = {
    'housing first': 'Housing First',
    'integrated services': 'Integrated Services',
    'survival services': 'Survival Services',
    'health services': 'Health Services',
    'employment services': 'Employment Services',
    research_innovation: 'Research & Innovation'
};

const rolesMap = {
    admin: 'Administrator',
    approver: 'Approver',
    requestor: 'Requestor',
    volunteer: 'Volunteer'
};

const UserRoles = ({ roles }) => {
    return (
        <div>
            {roles.map((role, i) => (
                <span
                    style={{ marginRight: '0.5rem', fontStyle: 'italic', fontSize: '1.125rem' }}
                    key={i}
                >{`${rolesMap[role]}${i !== roles.length - 1 ? ', ' : ''}`}</span>
            ))}
        </div>
    );
};

const UserProfileDetails = ({ user }) => {
    return (
        <div className="row">
            <div className="col s12 m6">
                <img
                    className="circle responsive-img"
                    style={{
                        backgroundColor: avatarBgColor,
                        display: 'block',
                        margin: '0 auto 2rem'
                    }}
                    width="200"
                    height="200"
                    src={avatar}
                    alt="default user avatar"
                />
            </div>
            <div className="col s12 m6 center-on-small-only">
                <h3
                    className="teal-text text-darken-2"
                    style={{ marginTop: '0' }}
                >{`${user.name.first} ${user.name.last}`}</h3>
                <h5 className="grey-text text-darken-2" style={{}}>
                    {programMap[user.program]}
                </h5>
                <UserRoles roles={user.roles} />
                <p
                    className="teal-text text-darken-2"
                    style={{ fontSize: '1.125rem', marginTop: '0.5rem' }}
                >
                    {user.email}
                </p>
            </div>
        </div>
    );
};

export default UserProfileDetails;
