import M from 'materialize-css';
import { useEffect } from 'react';
import useUpdateItem from '../../hooks/useUpdateItem';
import { useQueryClient } from 'react-query';
import ApproverActions from './ApproverActions';
import NoteDetails from './NoteDetails';
import AddNoteForm from './AddNoteForm';
import { inboxStyles as css, initCollapsibleElements, closedStatuses } from './utils';
import Pagination from '../Pagination';

const statusMap = {
    denied: 'Rejected',
    archived: 'Archived',
    fulfilled: 'Fulfilled'
};

const ListHeader = () => {
    return (
        <li>
            <div className="teal-text text-darken-3" style={css.listHeader}>
                <p style={css.flexItem}>Requestor</p>
                <p style={css.flexItem}>Item</p>
                <p style={css.flexItem}>Quantity</p>
                <p style={css.flexItem}>Request Date</p>
            </div>
        </li>
    );
};

const ApproverItemList = ({ filter, items, pageSize = 25 }) => {
    const [pageNum, setPageNum] = useState(0);
    const [displayableItems, setDisplayableItems] = useState([]);
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
            items.filter((item) => {
                if (Array.isArray(filter)) {
                    return filter.some((status) => status === item.status);
                }
                return item.status === filter;
            })
        );
    }, [items, filter]);

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

    const nextPage = () => {
        if (pageNum + 1 < displayableItems.length / pageSize) {
            setPageNum((num) => num + 1);
        }
    };

    const prevPage = () => {
        if (pageNum > 0) {
            setPageNum((num) => num - 1);
        }
    };

    const handlePageNumberClick = (num) => {
        setPageNum(num);
    };

    return (
        <>
            <ul className="collapsible expandable">
                <ListHeader />
                {displayableItems &&
                    displayableItems
                        .slice(pageNum * pageSize, pageNum * pageSize + pageSize)
                        .map((item) => {
                            return (
                                <li key={item.id}>
                                    <div className="collapsible-header" style={css.itemHeader}>
                                        <p style={css.flexItem}>
                                            {item.submittedBy.name.first}{' '}
                                            {item.submittedBy.name.last}
                                        </p>
                                        <p style={css.flexItemCapitialize}>{item.name}</p>
                                        <p style={css.flexItem}>{item.quantity}</p>
                                        <p style={css.flexItem}>
                                            {new Date(item.createdAt).toDateString()}
                                        </p>
                                    </div>
                                    <div className="collapsible-body">
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}
                                        >
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
            {displayableItems.length > pageSize ? (
                <Pagination
                    numPages={displayableItems.length / pageSize}
                    currentPage={pageNum + 1}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    onPageClick={handlePageNumberClick}
                />
            ) : null}
        </>
    );
};

export default ApproverItemList;
