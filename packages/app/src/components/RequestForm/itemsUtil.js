import availableItems from './availableItems';

export const itemCategoryMap = {
    Clothing: 'clothing',
    Household: 'household',
    'Personal Hygiene': 'personal hygiene',
    Engagement: 'engagement',
    Pets: 'pet',
    Tickets: 'ticket',
    Other: 'other'
};

export const itemMap = {
    Shirt: 'shirt',
    Coat: 'coat',
    Pants: 'pants',
    Shoes: 'shoes',
    Socks: 'socks',
    Underwear: 'underwear',
    Gloves: 'gloves',
    Bra: 'bra',
    Scarf: 'scarf',
    Hat: 'hat',
    Bedding: 'bedding',
    Pillow: 'pillow',
    Plates: 'plates',
    Cutlery: 'cutlery',
    'Pots & Pans': 'pots and pans',
    'Napkins/Paper Towels': 'napkins/paper towels',
    'Shower Curtain': 'shower cutain',
    Soap: 'soap',
    Shampoo: 'shampoo',
    Conditioner: 'conditioner',
    'Brush/Comb': 'brush/comb',
    Toothbrush: 'toothbrush',
    Toothpaste: 'toothpaste',
    Floss: 'floss',
    'Feminine Pad': 'feminine pad',
    Tampons: 'tampons',
    'Toilet Paper': 'toilet paper',
    Artwork: 'artwork',
    Games: 'games',
    'Candy/Treats': 'candy/treats',
    Other: 'other'
};

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
