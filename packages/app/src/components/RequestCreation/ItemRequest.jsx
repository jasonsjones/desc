import React from 'react';
import Select from './Select';
import TextField from '../Common/TextField';
import ItemOptionsUtility from './ItemOptionsUtility';

class ItemRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // TODO: nest item values in currentItem
            category: '',
            itemType: '',
            gender: '',
            size: '',
            count: '',
            notes: ''
        };

        this.itemOptionsUtility = new ItemOptionsUtility();
        this.handleInput = this.handleInput.bind(this);
        this.handleAddItem = this.handleAddItem.bind(this);
    }

    handleInput(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleAddItem() {
        // basic validation:
        if (this.state.category === '' || this.state.itemType === '') {
            return;
        }

        if (this.state.count === '') {
            this.setState(
                {
                    count: 1
                },
                () => {
                    this.props.onItemAdded({ ...this.state });
                    // Reset state
                    this.setState({
                        category: '',
                        itemType: '',
                        gender: '',
                        size: '',
                        count: '',
                        notes: ''
                    });
                }
            );
        } else {
            this.props.onItemAdded({ ...this.state });
            // Reset state
            this.setState({
                category: '',
                itemType: '',
                gender: '',
                size: '',
                count: '',
                notes: ''
            });
        }
    }

    getCategories() {
        return this.itemOptionsUtility.getCategories();
    }

    getItemsInCategory() {
        return this.itemOptionsUtility.getItemsInCategory(this.state.category);
    }

    getGenders() {
        return this.itemOptionsUtility.getGenders();
    }

    genderSelection() {
        let itemIsGendered = this.itemOptionsUtility.isItemGendered(
            this.state.category,
            this.state.itemType
        );
        if (itemIsGendered) {
            return (
                <Select
                    title={'Item Gender'}
                    name={'gender'}
                    options={this.getGenders()}
                    value={this.state.gender}
                    placeholder={'Select Gender'}
                    handleChange={this.handleInput}
                />
            );
        }
    }

    genericSizeSelection() {
        let itemGenericSizes = this.itemOptionsUtility.getItemSizesGeneric(
            this.state.category,
            this.state.itemType
        );
        if (itemGenericSizes) {
            return (
                <Select
                    title={'Item Size'}
                    name={'size'}
                    options={itemGenericSizes}
                    value={this.state.size}
                    placeholder={'Select Size'}
                    handleChange={this.handleInput}
                />
            );
        }
    }

    genderedSizeSelection() {
        let itemGenderSizes = this.itemOptionsUtility.getItemGenderSizes(
            this.state.category,
            this.state.itemType,
            this.state.gender
        );
        if (itemGenderSizes) {
            return (
                <Select
                    title={'Item Size'}
                    name={'size'}
                    options={itemGenderSizes}
                    value={this.state.size}
                    placeholder={'Select Size'}
                    handleChange={this.handleInput}
                />
            );
        }
    }

    categorySelection() {
        return (
            <Select
                title={'Category'}
                name={'category'}
                options={this.getCategories()}
                value={this.state.category}
                placeholder={'Select Category'}
                handleChange={this.handleInput}
            />
        );
    }

    itemTypeSelection() {
        return (
            <Select
                title={'Type of Item'}
                name={'itemType'}
                options={this.getItemsInCategory()}
                value={this.state.itemType}
                placeholder={'Select Item'}
                handleChange={this.handleInput}
            />
        );
    }

    itemCountSelection() {
        return (
            <TextField
                label="Number of Items Requested"
                type="number"
                name="count"
                value={this.state.count}
                handleChange={this.handleInput}
            />
        );
    }

    notesInput() {
        return (
            <TextField
                label="Notes"
                type="text"
                name="notes"
                value={this.state.notes}
                handleChange={this.handleInput}
            />
        );
    }

    render() {
        return (
            <form className="card-panel">
                <div className="card-content">
                    <h6>Item Details:</h6>
                    {this.categorySelection()}
                    {this.itemTypeSelection()}

                    {/* optional */}
                    {this.genderSelection()}
                    {this.genericSizeSelection() || this.genderedSizeSelection()}

                    {this.itemCountSelection()}

                    {this.notesInput()}
                </div>
                <div className="card-action">
                    <a className="btn" href="#!" onClick={this.handleAddItem}>
                        Add item
                    </a>
                </div>
            </form>
        );
    }
}

export default ItemRequest;
