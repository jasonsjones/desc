import { useEffect } from 'react';
import M from 'materialize-css';
import Spinner from '../Common/Spinner';
import RequestorItemList from './RequestorItemList';
import { useAuthContext } from '../../context/AuthContext';
import useItemsByUserId from '../../hooks/useItemsByUserId';

const RequestorInbox = () => {
    const authContext = useAuthContext();

    const { data, error, isLoading } = useItemsByUserId(authContext.contextUser.id);
    const items = (data && data.payload.items) || [];

    useEffect(() => {
        M.Tabs.init(document.querySelectorAll('.tabs'), {});
    }, [isLoading]);

    return (
        <div style={{ marginTop: '3rem' }}>
            {error && (
                <div className="center-align red-text text-lighten-1">
                    <h6>{error}</h6>
                </div>
            )}
            {isLoading ? (
                <div style={{ margin: '6rem 0', display: 'flex', justifyContent: 'center' }}>
                    <Spinner />
                </div>
            ) : (
                <div className="row" style={{ marginTop: '40px' }}>
                    <div className="col s12">
                        <ul className="tabs">
                            <li className="tab col s3">
                                <a className="active" href="#open">
                                    Open
                                </a>
                            </li>
                            <li className="tab col s3">
                                <a href="#approved">Approved</a>
                            </li>
                            <li className="tab col s3">
                                <a href="#declined">Declined</a>
                            </li>
                            <li className="tab col s3">
                                <a href="#wishlist">Wishlist</a>
                            </li>
                            <li className="tab col s3">
                                <a href="#fulfilled">Fulfilled</a>
                            </li>
                        </ul>
                    </div>
                    <div id="open" className="col s12">
                        <RequestorItemList type="open" items={items} filter="active" />
                    </div>
                    <div id="approved" className="col s12">
                        <RequestorItemList type="approved" items={items} filter="approved" />
                    </div>
                    <div id="declined" className="col s12">
                        <RequestorItemList type="declined" items={items} filter="denied" />
                    </div>
                    <div id="wishlist" className="col s12">
                        <RequestorItemList type="wishlist" items={items} filter="wishlist" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestorInbox;
