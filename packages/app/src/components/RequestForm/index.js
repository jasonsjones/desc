import React, { useContext, useState, useEffect, useReducer } from 'react';
import M from 'materialize-css';
import AuthContext from '../../context/AuthContext';
import TextField from '../Common/TextField';
import Select from '../Common/Select';
import { initialState, itemReducer } from './itemReducer';
import * as ItemUtil from './itemsUtil';
import { makeClientRequest } from '../../services/clientRequests';

const initSelect = () => {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
};

const ItemForm = ({ onItemAdd }) => {
    const [state, dispatch] = useReducer(itemReducer, initialState);

    useEffect(() => {
        initSelect();
    }, []);

    useEffect(() => {
        Promise.resolve().then(() => {
            initSelect();
        });
    }, [state]);

    const disableCount = () => {
        return state.selectedItem.length === 0;
    };

    const handleSelection = field => {
        return e => {
            switch (field) {
                case 'category':
                    dispatch({ type: 'CATEGORY_SELECTED', payload: e.target.value });
                    break;
                case 'item':
                    dispatch({ type: 'ITEM_SELECTED', payload: e.target.value });
                    break;
                case 'size':
                    dispatch({ type: 'SIZE_SELECTED', payload: e.target.value });
                    break;
                case 'count':
                    dispatch({ type: 'COUNT_CHANGED', payload: e.target.value });
                    break;
                case 'note':
                    dispatch({ type: 'NOTE_ADDED', payload: e.target.value });
                    break;
                default:
                    break;
            }
        };
    };

    const handleSubmit = evt => {
        evt.preventDefault();
        if (state.selectedItem.length > 0 && state.count > 0) {
            onItemAdd({
                category: state.selectedCategory,
                item: state.selectedItem,
                size: state.selectedSize,
                count: state.count,
                note: state.note
            });
            dispatch({ type: 'CLEAR_STATE' });
        }
    };

    return (
        <div>
            <h6 className="teal-text text-darken-3">Select Item Details:</h6>
            <Select
                title="Category"
                name="category"
                options={ItemUtil.getCategories()}
                value={state.selectedCategory}
                placeholder="Select Category"
                handleChange={handleSelection('category')}
            />
            <Select
                title="Type of Item"
                name="itemType"
                options={state.availableItems}
                value={state.selectedItem}
                placeholder="Select Item"
                handleChange={handleSelection('item')}
                disabled={state.availableItems.length === 0}
            />

            {state.availableSizes.length > 0 && (
                <Select
                    title="Item Size"
                    name="size"
                    options={state.availableSizes}
                    value={state.selectedSize}
                    placeholder="Select Size"
                    handleChange={handleSelection('size')}
                />
            )}
            <TextField
                label="Number of Items Requested"
                type="number"
                name="count"
                value={state.count}
                handleChange={handleSelection('count')}
                disabled={disableCount()}
            />

            <TextField
                label="Add a Note"
                type="text"
                name="note"
                value={state.note}
                handleChange={handleSelection('note')}
                disabled={state.selectedItem.length === 0}
            />

            <div className="row">
                <div className="col right">
                    <button
                        className="waves-effect waves-light btn"
                        type="button"
                        onClick={handleSubmit}
                    >
                        Add Item
                    </button>
                </div>
            </div>
        </div>
    );
};

const RequestedItem = ({ item, id, onDelete, showBottomBorder }) => {
    const itemStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '1.25rem',
        borderBottom: `${showBottomBorder ? '1px solid #ccc' : ''}`,
        padding: '1.5rem 0'
    };

    return (
        <div style={itemStyles}>
            <p style={{ flex: '0 0 30%' }}>{`${item.quantity} ${item.size} ${item.name}`}</p>
            <p style={{ flex: '0 0 60%' }}>
                {item.note && item.note.length > 0 && <em>Note: </em>}
                {item.note && item.note.length > 0 ? item.note : ''}
            </p>
            <i
                style={{ cursor: 'pointer', flex: '0 0 auto' }}
                onClick={() => onDelete(id)}
                className="small material-icons teal-text"
            >
                clear
            </i>
        </div>
    );
};

const NewRequestForm = () => {
    const authCtx = useContext(AuthContext);
    const [form, setForm] = useState({
        clientId: '',
        location: 'default',
        remember: false,
        requestorId: authCtx.contextUser.id,
        items: []
    });

    useEffect(() => {
        Promise.resolve().then(() => {
            initSelect();
        });
    }, [form.location]);

    const handleChange = e => {
        if (e.target.id === 'remember') {
            setForm({
                ...form,
                remember: e.target.checked
            });
        } else {
            setForm({
                ...form,
                [e.target.id]: e.target.value
            });
        }
    };

    const handleAddItem = itemState => {
        const transformedItem = {
            clientId: form.clientId,
            requestorId: form.requestorId,
            status: 'active',
            location: form.location,
            note: itemState.note,
            category: itemState.category,
            name: itemState.item,
            size: itemState.size,
            quantity: itemState.count
        };

        setForm(() => {
            return {
                ...form,
                items: [...form.items, transformedItem]
            };
        });
    };

    const handleDeleteItem = id => {
        setForm(() => {
            return {
                ...form,
                items: form.items.filter((_, i) => i !== id)
            };
        });
    };

    const isRequestValid = () => {
        return form.clientId && form.location && form.items.length > 0;
    };

    const handleSubmitRequest = e => {
        e.preventDefault();

        if (isRequestValid()) {
            // make clone of form data to tranform a bit so the API is happy
            const formData = {
                ...form,
                items: form.items.map(item => {
                    return {
                        ...item,
                        category: ItemUtil.itemCategoryMap[item.category],
                        name: ItemUtil.itemMap[item.name]
                    };
                })
            };
            makeClientRequest(formData, authCtx.token)
                .then(data => {
                    if (data.success) {
                        if (form.remember) {
                            setForm({
                                ...form,
                                items: []
                            });
                        } else {
                            setForm({
                                ...form,
                                clientId: '',
                                location: '',
                                items: []
                            });
                            document.querySelector('#location').value = 'default';
                        }
                        M.toast({ html: 'Request has been submitted', classes: 'teal' });
                        // navigate to home?
                    } else {
                        M.toast({
                            html: 'Oops.  Something went wrong submitting your request ',
                            classes: 'red lighten-1'
                        });
                        setForm({
                            ...form,
                            items: []
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    return (
        <form
            onSubmit={handleSubmitRequest}
            className="card-panel"
            style={{ padding: '20px 30px', maxWidth: '670px', margin: '2.5rem auto' }}
        >
            <h5 className="center-align teal-text text-darken-3">New Request</h5>
            <div className="row">
                <div className="col s6">
                    <TextField
                        label="Client ID"
                        type="text"
                        name="clientId"
                        value={form.clientId}
                        handleChange={handleChange}
                    />
                </div>
                <div className="input-field col s6">
                    <i className="small material-icons prefix">domain</i>
                    <select defaultValue="default" id="location" onChange={handleChange}>
                        <option value="default" disabled>
                            Select your location
                        </option>
                        <option value="eastlake">1811 Eastlake</option>
                        <option value="aurora house">Aurora House</option>
                        <option value="canaday house">Canaday House</option>
                        <option value="clement place">Clement Place</option>
                        <option value="cottage grove commons">Cottage Grove Commons</option>
                        <option value="estelle">The Estelle</option>
                        <option value="evans house">Evans House</option>
                        <option value="interbay place">Interbay Place</option>
                        <option value="kerner-scott house">Kerner-Scott House</option>
                        <option value="keys">Keys to Home</option>
                        <option value="lyon building">Lyon Building</option>
                        <option value="morrison">The Morrison</option>
                        <option value="rainier house">Rainier House</option>
                        <option value="union hotel">The Union Hotel</option>
                    </select>
                    <label htmlFor="location">Location</label>
                </div>
            </div>
            <div className="row">
                <div className="col s12">
                    <label>
                        <input
                            type="checkbox"
                            id="remember"
                            checked={form.remember}
                            onChange={handleChange}
                        />
                        <span>Remember Client ID and Location</span>
                    </label>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }} className="col s12">
                <ItemForm onItemAdd={handleAddItem} />
            </div>
            {form.items.length > 0 && (
                <>
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title teal-text text-darken-3">
                                Requested Items:
                            </span>
                            {form.items.map((item, index) => (
                                <RequestedItem
                                    key={index}
                                    item={item}
                                    id={index}
                                    onDelete={handleDeleteItem}
                                    showBottomBorder={index !== form.items.length - 1}
                                />
                            ))}
                        </div>
                    </div>
                    <button className="waves-effect waves-light btn" type="submit">
                        Submit Request
                    </button>
                </>
            )}
        </form>
    );
};

export default NewRequestForm;
