import React from 'react';
import M from 'materialize-css';
import { connect } from 'react-redux';
import RequestRow from './RequestRow';

const css = {
    listHeader: {
        fontWeight: 'bold',
        display: 'flex',
        padding: '1rem 2rem',
        borderBottom: '2px #999 solid'
    },

    flexItem: {
        flex: '0 0 25%'
    }
};

class RequestedItemsList extends React.Component {
    componentDidMount() {
        const bgClasses = ['teal', 'lighten-5'];
        const onOpenStartCb = el => {
            el.querySelector('.collapsible-header').classList.add(...bgClasses);
        };
        const onCloseEndCb = el => {
            el.querySelector('.collapsible-header').classList.remove(...bgClasses);
        };
        const elems = document.querySelectorAll('.collapsible.expandable');
        M.Collapsible.init(elems, {
            accordion: false,
            onOpenStart: onOpenStartCb,
            onCloseEnd: onCloseEndCb
        });
    }

    render() {
        return (
            <div>
                <ul className="collapsible expandable with-header">
                    <li>
                        <div className="teal-text text-darken-3" style={css.listHeader}>
                            <p style={css.flexItem}>Requestor</p>
                            <p style={css.flexItem}>Item</p>
                            <p style={css.flexItem}>Quantity</p>
                            <p style={css.flexItem}>Request Date</p>
                        </div>
                    </li>
                    {this.props.items &&
                        this.props.items
                            .filter(item => item.status === this.props.type)
                            .map(item => (
                                <RequestRow key={item.id} {...item} token={this.props.token} />
                            ))}
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
