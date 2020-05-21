import * as ItemUtil from './itemsUtil';

export const initialState = {
    selectedCategory: '',
    availableItems: [],
    selectedItem: '',
    availableSizes: [],
    selectedSize: '',
    count: '',
    note: ''
};

export const itemReducer = (state, action) => {
    switch (action.type) {
        case 'CATEGORY_SELECTED':
            return {
                ...state,
                selectedCategory: action.payload,
                availableItems: ItemUtil.getItemsInCategory(action.payload),
                availableSizes: [],
                selectedItem: '',
                selectedSize: '',
                count: '',
                note: ''
            };
        case 'ITEM_SELECTED':
            if (action.payload === 'Bra') {
                return {
                    ...state,
                    selectedItem: action.payload,
                    selectedSize: '',
                    availableSizes: ItemUtil.getBraSizes(),
                    count: '',
                    note: ''
                };
            }

            if (action.payload === 'Scarf' || action.payload === 'Hat') {
                return {
                    ...state,
                    selectedItem: action.payload,
                    selectedSize: '',
                    availableSizes: [],
                    count: '',
                    note: ''
                };
            }

            const sizes =
                state.selectedCategory === 'Clothing'
                    ? ItemUtil.getItemSizes(state.selectedCategory, action.payload)
                    : [];
            return {
                ...state,
                selectedItem: action.payload,
                selectedSize: '',
                availableSizes: sizes,
                count: ''
            };
        case 'SIZE_SELECTED':
            return {
                ...state,
                selectedSize: action.payload,
                count: ''
            };
        case 'COUNT_CHANGED':
            return {
                ...state,
                count: action.payload
            };
        case 'NOTE_ADDED':
            return {
                ...state,
                note: action.payload
            };
        case 'CLEAR_STATE':
            return initialState;
        default:
            return state;
    }
};
