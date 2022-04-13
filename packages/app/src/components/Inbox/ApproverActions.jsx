import { closedStatuses } from './utils';

function ApproverActions({ filter, item, onStatusChange }) {
    const isItemClosed = () => {
        return closedStatuses.some((status) => status === item.status);
    };

    return (
        <div className="actions">
            {filter !== 'approved' ? (
                <button
                    className="btn-small btn-flat"
                    onClick={() => onStatusChange(item.id, 'approved')}
                >
                    <i className="material-icons left">check_box</i>
                    Approve
                </button>
            ) : null}

            {filter === 'approved' ? (
                <button
                    className="btn-small btn-flat"
                    onClick={() => onStatusChange(item.id, 'fulfilled')}
                >
                    <i className="material-icons left">check_box</i>
                    Fulfilled
                </button>
            ) : null}

            <button
                className={`btn-small btn-flat ${item.status === 'denied' ? 'disabled' : ''}`}
                onClick={() => onStatusChange(item.id, 'denied')}
            >
                <i className="material-icons left">clear</i>
                Reject
            </button>

            <button
                className={`btn-small btn-flat ${item.status === 'wishlist' ? 'disabled' : ''}`}
                onClick={() => onStatusChange(item.id, 'wishlist')}
            >
                <i className="material-icons left">access_time</i>
                Wishlist
            </button>

            {isItemClosed() ? (
                <button
                    className="btn-small btn-flat"
                    onClick={() => onStatusChange(item.id, 'active')}
                >
                    <i className="material-icons left">undo</i>
                    Reset to <em>Active</em>
                </button>
            ) : null}
        </div>
    );
}

export default ApproverActions;
