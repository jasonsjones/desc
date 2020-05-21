export enum UserRole {
    ADMIN = 'admin',
    APPROVER = 'approver',
    REQUESTOR = 'requestor',
    VOLUNTEER = 'volunteer',
    UNKNOWN = 'unknown'
}

export enum Program {
    HOUSING = 'housing first',
    INTEGRATED = 'integrated services',
    SURVIVAL = 'survival services',
    HEALTH = 'health services',
    EMPLOYMENT = 'employment services',
    RESEARCH_INNOVATION = 'research_innovation',
    UNKNOWN = 'unknown'
}
export interface UserFields {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    program?: Program;
    roles?: UserRole[];
}

export type UpdatableUserFields = Partial<Omit<UserFields, 'password' | 'roles'>>;

export enum ItemCategory {
    CLOTHING = 'clothing',
    ENGAGEMENT = 'engagement',
    HOUSEHOLD = 'household',
    PERSONAL_HYGIENE = 'personal hygiene',
    PET = 'pet',
    TICKET = 'ticket',
    OTHER = 'other'
}

export enum ItemPriority {
    URGENT = 'urgent',
    STANDARD = 'standard'
}

export enum ItemStatus {
    ACTIVE = 'active',
    APPROVED = 'approved',
    DENIED = 'denied',
    FUFILLED = 'fulfilled',
    WISHLIST = 'wishlist',
    ARCHIVED = 'archived'
}

export enum HouseLocation {
    EASTLAKE = 'eastlake',
    AURORA_HOUSE = 'aurora house',
    CANADAY_HOUSE = 'canaday house',
    CLEMENT_PLACE = 'clement place',
    COTTAGE_GROVE_COMMONS = 'cottage grove commons',
    ESTELLE = 'estelle',
    EVANS_HOUSE = 'evans house',
    INTERBAY_PLACE = 'interbay place',
    KERNER_SCOTT_HOUSE = 'kerner-scott house',
    KEYS = 'keys',
    LYON_BUILDING = 'lyon building',
    MORRISON = 'morrison',
    RAINIER_HOUSE = 'rainier house',
    UNION_HOTEL = 'union hotel'
}

// Sizes
export const availableShirtOrCoatSizes = [
    'XS (0/32)',
    'S (2-4/34-36)',
    'M (6-8/38-40)',
    'L (10-12/42-44)',
    'XL (14-16/46)',
    'XXL (18-20/48)',
    'XXXL (22-24-50)'
] as const;
type ShirtOrCoatSizes = typeof availableShirtOrCoatSizes[number];

export const availablePantSizes = [
    'XS (25-26/28',
    'S (27-29/30)',
    'M (30-32/32)',
    'L (33-37/34)',
    'XL (38-41/36)',
    'XXL (42-46/38)',
    'XXXL (47+/40+)'
] as const;
type PantSizes = typeof availablePantSizes[number];

export const availableShoeSizes = [
    "Women's 4",
    "Women's 4.5",
    "Women's 5",
    "Women's 5.5",
    "Women's 6",
    "Women's 6.5",
    "Women's 7",
    "Women's 7.5",
    "Women's 8",
    "Women's 8.5",
    "Women's 9",
    "Women's 9.5",
    "Women's 10",
    "Women's 10.5",
    "Women's 11",
    "Women's 11.5",
    "Women's 12",
    "Men's 6",
    "Men's 6.5",
    "Men's 7",
    "Men's 7.5",
    "Men's 8",
    "Men's 8.5",
    "Men's 9",
    "Men's 9.5",
    "Men's 10",
    "Men's 10.5",
    "Men's 11",
    "Men's 11.5",
    "Men's 12",
    "Men's 12.5",
    "Men's 13",
    "Men's 13.5",
    "Men's 14",
    "Men's 14.5",
    "Men's 15",
    "Men's 15.5",
    "Men's 16"
] as const;
type ShoeSizes = typeof availableShoeSizes[number];

export const availableSockOrUnderwearSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;
type SockOrUnderwearSizes = typeof availableSockOrUnderwearSizes[number];

export const availableBraSizes = [
    'S (32-34, A-B)',
    'M (34-37, B-C)',
    'L (37-41, C-D)',
    'XL (40-43 D-E)',
    'XXXL (43+ D+)'
] as const;
type BraSizes = typeof availableSockOrUnderwearSizes[number];

export const availableGloveSizes = ['S', 'M', 'L'] as const;
type GloveSizes = typeof availableGloveSizes[number];

// Clothing Items
export const availableClothingItems = [
    'shirt',
    'coat',
    'pants',
    'shoes',
    'socks',
    'underwear',
    'bra',
    'scarf',
    'hats',
    'other'
] as const;

interface ClothingShirtOrCoatFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'shirt' | 'coat';
    size: ShirtOrCoatSizes;
}

interface ClothingPantFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'pants';
    size: PantSizes;
}

interface ClothingShoeFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'shoes';
    size: ShoeSizes;
}

interface ClothingSockOrUnderwearFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'socks' | 'underwear';
    size: SockOrUnderwearSizes;
}

interface ClothingBraFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'bra';
    size: BraSizes;
}

interface ClothingGlovesFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'gloves';
    size: GloveSizes;
}

// Engagement Items
export const availableEngagementItems = ['games', 'artwork', 'candy/treats', 'other'] as const;
export type EngagementItems = typeof availableEngagementItems[number];
interface EngagementItemFields extends BaseItemFields {
    category: ItemCategory.ENGAGEMENT;
    name: EngagementItems;
}

// Household Items
export const availableHouseholdItems = [
    'bedding',
    'pillows',
    'plates',
    'cutlery',
    'pots and pans',
    'napkins/paper towels',
    'shower curtain',
    'other'
] as const;
export type HouseholdItems = typeof availableHouseholdItems[number];
interface HouseholdItemFields extends BaseItemFields {
    category: ItemCategory.HOUSEHOLD;
    name: HouseholdItems;
}

// Personal Hygiene Items
export const availablePersonalHygieneItems = [
    'soap',
    'shampoo',
    'conditioner',
    'brush/comb',
    'toothbrush',
    'toothpaste',
    'floss',
    'feminine pad',
    'tampons',
    'toilet paper',
    'other'
] as const;
export type PersnalHygieneItems = typeof availablePersonalHygieneItems[number];
interface PersonalHygieneFields extends BaseItemFields {
    category: ItemCategory.PERSONAL_HYGIENE;
    name: PersnalHygieneItems;
}

// Pet Items
export const availablePetItems = ['specify'] as const;
export type PetItems = typeof availablePetItems[number];
interface PetFields extends BaseItemFields {
    category: ItemCategory.PET;
    name: PetItems;
}

// Ticket Items
export const availableTicketItems = ['specify'] as const;
export type TicketItems = typeof availableTicketItems[number];
interface TicketFields extends BaseItemFields {
    category: ItemCategory.TICKET;
    name: TicketItems;
}

// Other
export const availableOtherItems = ['specify'] as const;
export type OtherItems = typeof availableOtherItems[number];
interface OtherFields extends BaseItemFields {
    category: ItemCategory.OTHER;
    name: OtherItems;
}

export interface NoteFields {
    body: string;
    userId?: string;
    itemId?: string;
}

interface BaseItemFields {
    clientId: string;
    requestorId: string;
    location: HouseLocation;
    size?: string;
    quantity?: number;
    priority?: ItemPriority;
    status?: ItemStatus;
    note?: string;
}

export type ItemFields =
    | ClothingShirtOrCoatFields
    | ClothingPantFields
    | ClothingShoeFields
    | ClothingSockOrUnderwearFields
    | ClothingBraFields
    | ClothingGlovesFields
    | EngagementItemFields
    | HouseholdItemFields
    | PersonalHygieneFields
    | PetFields
    | TicketFields
    | OtherFields;

export type UpdatableItemFields = Partial<ItemFields>;
