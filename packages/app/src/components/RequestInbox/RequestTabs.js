import React from 'react';
import { connect } from 'react-redux';
import M from 'materialize-css';

import RequestedItemsList from './RequestedItemsList';
import * as actions from '../../actions/actions';

class Tabs extends React.Component {
    componentDidMount() {
        M.Tabs.init(document.querySelectorAll('.tabs'), {});
        this.props.fetchItems(this.props.token);
    }

    render() {
        return (
            <div>
                <div className="row" style={{ marginTop: '40px' }}>
                    <div className="col s12">
                        <ul className="tabs">
                            <li className="tab col s3">
                                <a className="active" href="#active">
                                    Active
                                </a>
                            </li>
                            <li className="tab col s3">
                                <a href="#approved">Approved</a>
                            </li>
                            <li className="tab col s3">
                                <a href="#wishlist">Wishlist</a>
                            </li>
                            <li className="tab col s3 disabled">
                                <a href="#archive">Archive</a>
                            </li>
                        </ul>
                    </div>
                    <div id="active" className="col s12">
                        <RequestedItemsList
                            title="Active Requests"
                            type="active"
                            token={this.props.token}
                        />
                    </div>
                    <div id="approved" className="col s12">
                        <RequestedItemsList
                            title="Approved Requests"
                            type="approved"
                            token={this.props.token}
                        />
                    </div>
                    <div id="wishlist" className="col s12">
                        <RequestedItemsList
                            title="Wishlist Requests"
                            type="wishlist"
                            token={this.props.token}
                        />
                    </div>
                    <div id="archive" className="col s12">
                        <RequestedItemsList
                            title="Archive Requests"
                            type="archive"
                            token={this.props.token}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchItems: token => dispatch(actions.fetchItems(token))
    };
};

export default connect(null, mapDispatchToProps)(Tabs);
