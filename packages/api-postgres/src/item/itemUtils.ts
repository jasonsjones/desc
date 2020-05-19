import {
    availableEngagementItems,
    availableHouseholdItems,
    availablePersonalHygieneItems,
    availablePetItems,
    availableTicketItems,
    availableOtherItems,
    availableShirtOrCoatSizes,
    availableSockOrUnderwearSizes,
    availablePantSizes,
    availableShoeSizes,
    availableBraSizes,
    availableClothingItems
} from '../common/types';

const fieldsToNormalize = ['category', 'name', 'location', 'priority', 'status' ];

export function normalizeData(payload: any): any {
    let data: any = {};

    for (let key in payload) {
        if (typeof payload[key] === 'string' && fieldsToNormalize.includes(key)) {
            data[key] = payload[key].toLowerCase();
        } else {
            data[key] = payload[key];
        }
    }
    return data;
}

export function isValidItemForCategory(category: string, item: any): boolean {
    let result = false;
    switch (category) {
        case 'clothing':
            if (availableClothingItems.includes(item)) {
                result = true;
            }
            break;
        case 'engagement':
            if (availableEngagementItems.includes(item)) {
                result = true;
            }
            break;
        case 'household':
            if (availableHouseholdItems.includes(item)) {
                result = true;
            }
            break;
        case 'personal hygiene':
            if (availablePersonalHygieneItems.includes(item)) {
                result = true;
            }
            break;
        case 'pet':
            if (availablePetItems.includes(item)) {
                result = true;
            }
            break;
        case 'ticket':
            if (availableTicketItems.includes(item)) {
                result = true;
            }
            break;
        case 'other':
            if (availableOtherItems.includes(item)) {
                result = true;
            }
            break;
        default:
            break;
    }
    return result;
}

export function isValidSizeForItem(itemName: string, size: any): boolean {
    let result = false;
    switch (itemName) {
        case 'shirt':
        case 'coat':
            if (availableShirtOrCoatSizes.includes(size)) {
                result = true;
            }
            break;

        case 'pants':
            if (availablePantSizes.includes(size)) {
                result = true;
            }
            break;

        case 'shoes':
            if (availableShoeSizes.includes(size)) {
                result = true;
            }
            break;

        case 'socks':
        case 'underwear':
            if (availableSockOrUnderwearSizes.includes(size)) {
                result = true;
            }
            break;

        case 'bra':
            if (availableBraSizes.includes(size)) {
                result = true;
            }
            break;

        case 'hat':
        case 'scarf':
            if (size === null || size === undefined || size === '') {
                result = true;
            }
            break;

        default:
            break;
    }
    return result;
}
