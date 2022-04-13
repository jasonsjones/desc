import React from 'react';

class RequestedItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getRequestedItems() {
        if (this.props.items && this.props.items.length > 0) {
            let requestedItems = this.props.items.map((item, i) => (
                // TODO: make separate component for each row
                <p key={i}>
                    {item.count} {item.gender} {item.size} {item.itemType}{' '}
                    {item.count > 1 ? '(s)' : ''}
                    {item.notes && item.notes.length > 0 ? ' - Note: ' + item.notes : ''}
                </p>
            ));

            return requestedItems;
        } else {
            return <p>Your cart is empty</p>;
        }
    }

    render() {
        return (
            <div className="card-panel">
                <h6>Items to request:</h6>

                {this.getRequestedItems()}
            </div>
        );
    }
}

export default RequestedItems;
