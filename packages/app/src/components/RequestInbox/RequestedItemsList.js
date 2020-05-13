import React from 'react';
import M from 'materialize-css';
import { connect } from 'react-redux';
import RequestRow from './RequestRow';

class RequestedItemsList extends React.Component {
    componentDidMount() {
        const elems = document.querySelectorAll('.collapsible.expandable');
        M.Collapsible.init(elems, { accordion: false });
    }

    render() {
        return (
            <div>
                <ul className="collapsible expandable with-header">
                    <li className="collection-header">
                        <div className="row">
                            <div className="col offset-s1 ">Requestor</div>
                            <div className="col offset-s1 ">Item</div>
                            <div className="col offset-s2 ">Quantity</div>
                            <div className="col offset-s3">Request Date</div>
                        </div>
                    </li>
                    {this.props.items &&
                        this.props.items
                            .filter(item => item.status === this.props.type)
                            .map(item => <RequestRow key={item.id} {...item} />)}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        items: state.items
    };
};

export default connect(mapStateToProps)(RequestedItemsList);
