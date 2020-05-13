import React, { useContext } from 'react';
import RequestorInbox from '../components/RequestorInbox';
import RequestTabs from '../components/RequestInbox/RequestTabs';
import AuthContext from '../context/AuthContext';

const Inbox = () => {
    const authContext = useContext(AuthContext);
    const isApprover = authContext.contextUser.roles.includes('approver');
    const isRequestor = authContext.contextUser.roles.includes('requestor');
    return (
        <React.Fragment>
            {isRequestor && <RequestorInbox />}
            {isApprover && (
                <AuthContext.Consumer>
                    {({ token }) => <RequestTabs token={token} />}
                </AuthContext.Consumer>
            )}
            {!isApprover && !isRequestor && <h3>Unknown Role</h3>}
        </React.Fragment>
    );
};

export default Inbox;
