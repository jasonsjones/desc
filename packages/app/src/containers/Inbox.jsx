import React from 'react';
import { ApproverInbox, RequestorInbox } from '../components/Inbox';
import { useAuthContext } from '../context/AuthContext';

const Inbox = () => {
    const authContext = useAuthContext();
    const isApprover = authContext.contextUser.roles.includes('approver');
    const isRequestor = authContext.contextUser.roles.includes('requestor');

    return (
        <React.Fragment>
            {isRequestor && <RequestorInbox />}
            {isApprover && <ApproverInbox />}
            {!isApprover && !isRequestor && <h3>Unknown Role</h3>}
        </React.Fragment>
    );
};

export default Inbox;
