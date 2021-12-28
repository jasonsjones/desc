import M from 'materialize-css';
import { useEffect } from 'react';
import useUpdateItem from '../../hooks/useUpdateItem';
import { useQueryClient } from 'react-query';
import ApproverActions from './ApproverActions';
import NoteDetails from './NoteDetails';
import AddNoteForm from './AddNoteForm';
import { inboxStyles as css, initCollapsibleElements, closedStatuses } from './utils';

const statusMap = {
    denied: 'Rejected',
    archived: 'Archived',
    fulfilled: 'Fulfilled'
};

function sortBy(key, order = 'asc') {
    return function innerSort(a, b) {
        let valA, valB;
        let comparison = 0;
        switch (key) {
            case 'name':
                valA = a.submittedBy.name.first;
                valB = b.submittedBy.name.first;
                break;
            case 'clientId':
                valA = a.clientId;
                valB = b.clientId;
                break;
            case 'date':
                valA = a.createdAt;
                valB = b.createdAt;
                break;
            default:
                break;
        }
        if (valA > valB) {
            comparison = 1;
        } else if (valA < valB) {
            comparison = -1;
        }
        return order === 'desc' ? comparison * -1 : comparison;
    };
}

const ListHeader = ({ onHeaderClick }) => {
    return (
        <li>
            <div className="teal-text text-darken-3 align-center" style={css.listHeader}>
                <p style={css.flexItem}>Requestor</p>
                <p style={css.flexItem}>Item</p>
                <p style={css.flexItem}>Quantity</p>
                <div style={css.flexItem}>
                    <div
                        className="flex align-center"
                        style={{ cursor: 'pointer', gap: '0.5rem' }}
                        onClick={() => onHeaderClick()}
                    >
                        <span>Request Date</span>
                        <i className={`small material-icons prefix`}>sort</i>
                    </div>
                </div>
            </div>
        </li>
    );
};

const ApproverItemList = ({ filter, items }) => {
    const [displayableItems, setDisplayableItems] = useState([]);
    const [sortCol] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const queryClient = useQueryClient();

    const { updateItem } = useUpdateItem((response) => {
        if (response.success) {
            queryClient.invalidateQueries('items');
        }
    });

    useEffect(() => {
        initCollapsibleElements(M);
    }, []);

    useEffect(() => {
        setDisplayableItems(
            items
                .filter((item) => {
                    if (Array.isArray(filter)) {
                        return filter.some((status) => status === item.status);
                    }
                    return item.status === filter;
                })
                .sort(sortBy(sortCol, sortOrder))
        );
    }, [items, filter, sortCol, sortOrder]);

    const handleNoteAdd = (itemId, itemData) => {
        setDisplayableItems(
            displayableItems.map((item) => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        updatedAt: itemData.updatedAt,
                        notes: [...itemData.notes]
                    };
                }
                return {
                    ...item
                };
            })
        );
    };

    const updateItemStatus = (id, status) => {
        updateItem({ itemId: id, itemData: { status } });
    };

    const isItemClosed = (item) => {
        return closedStatuses.some((status) => status === item.status);
    };

    const toggleSortOrder = () => {
        sortOrder === 'desc' ? setSortOrder('asc') : setSortOrder('desc');
    };

    return (
        <ul className="collapsible expandable">
            <ListHeader onHeaderClick={toggleSortOrder} />
            {displayableItems &&
                displayableItems.map((item) => {
                    return (
                        <li key={item.id}>
                            <div className="collapsible-header" style={css.itemHeader}>
                                <p style={css.flexItem}>
                                    {item.submittedBy.name.first} {item.submittedBy.name.last}
                                </p>
                                <p style={css.flexItemCapitialize}>{item.name}</p>
                                <p style={css.flexItem}>{item.quantity}</p>
                                <p style={css.flexItem}>
                                    {new Date(item.createdAt).toDateString()}
                                </p>
                            </div>
                            <div className="collapsible-body">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <ApproverActions
                                        filter={filter}
                                        item={item}
                                        onStatusChange={updateItemStatus}
                                    />
                                    {isItemClosed(item) ? (
                                        <span className="text-grey-lighten-1">
                                            <em>{statusMap[item.status]}</em>
                                        </span>
                                    ) : null}
                                </div>
                                <p style={{ fontSize: '1.125rem', marginBottom: '.5rem' }}>
                                    Notes:
                                </p>
                                {item.notes.map((note) => (
                                    <NoteDetails key={note.id} note={note} />
                                ))}
                                <AddNoteForm itemId={item.id} onNoteAdd={handleNoteAdd} />
                            </div>
                        </li>
                    );
                })}
            {(!displayableItems || displayableItems.length === 0) && (
                <li>
                    <div style={{ padding: '1rem' }}>No items available</div>
                </li>
            )}
        </ul>
    );
};

export default ApproverItemList;
