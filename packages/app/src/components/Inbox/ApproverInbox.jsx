import M from 'materialize-css';
import { useEffect } from 'react';
import Spinner from '../Common/Spinner';
import ApproverItemList from './ApproverItemList';
import useItems from '../../hooks/useItems';

const ApproverInbox = () => {
    const { data, isLoading } = useItems();
    const items = (data && data.payload.items) || [];

    useEffect(() => {
        M.Tabs.init(document.querySelectorAll('.tabs'), {});
    }, [isLoading]);

    return (
        <div style={{ marginTop: '3rem' }}>
            {isLoading ? (
                <div style={{ margin: '6rem 0', display: 'flex', justifyContent: 'center' }}>
                    <Spinner />
                </div>
            ) : (
                <div className="row" style={{ marginTop: '40px' }}>
                    <div className="col s12">
                        <ul className="tabs">
                            <li className="tab col s3">
                                <a className="active" href="#active">
                                    Active
                                </a>
                            </li>
                            <li className="tab col s3">
                                <a href="#approved">In Process</a>
                            </li>
                            <li className="tab col s3">
                                <a href="#wishlist">Wishlist</a>
                            </li>
                            <li className="tab col s3">
                                {/* Fullfilled, rejected, or archived */}
                                <a href="#archive">Closed</a>
                            </li>
                        </ul>
                    </div>
                    <div id="active" className="col s12">
                        <ApproverItemList items={items} filter="active" />
                    </div>
                    <div id="approved" className="col s12">
                        <ApproverItemList items={items} filter="approved" />
                    </div>
                    <div id="wishlist" className="col s12">
                        <ApproverItemList items={items} filter="wishlist" />
                    </div>
                    <div id="archive" className="col s12">
                        <ApproverItemList
                            items={items}
                            filter={['denied', 'fulfilled', 'archived']}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApproverInbox;
