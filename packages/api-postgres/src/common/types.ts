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

// Engagement Items
export const availableEngagementItems = ['games', 'artwork', 'candy/treats'] as const;
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
    'shower curtain'
];
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
    'toilet paper'
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
    quantity?: number;
    priority?: ItemPriority;
    status?: ItemStatus;
    note?: string;
}

export type ItemFields =
    | EngagementItemFields
    | HouseholdItemFields
    | PersonalHygieneFields
    | PetFields
    | TicketFields
    | OtherFields;

export type UpdatableItemFields = Partial<ItemFields>;
