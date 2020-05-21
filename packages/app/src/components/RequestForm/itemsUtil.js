import availableItems from './availableItems';

/**
 * Get all item categories
 */
export const getCategories = () => {
    return Object.keys(availableItems);
};
/**
 * Get types of items within given category
 */
export const getItemsInCategory = category => {
    if (availableItems[category]) {
        return Object.keys(availableItems[category]);
    } else {
        return [];
    }
};

export const getItemSizes = (category, itemType) => {
    const result = Object.keys(availableItems)
        .filter(cat => cat === category)
        .filter(cat => !!availableItems[cat][itemType])
        .map(cat => availableItems[cat][itemType].sizes);

    return result.length > 0 ? result[0] : [];
};

export const getBraSizes = () => {
    return availableItems['Clothing']['Bra'].sizes;
};
