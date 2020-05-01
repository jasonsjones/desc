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
    roles?: [UserRole];
}

export type UpdatableUserFields = Partial<Omit<UserFields, 'password' | 'roles'>>;

export enum ItemCategory {
    ENGAGEMENT = 'engagement',
    HOUSEHOLD = 'household'
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

export type EngagementItems = 'games' | 'artwork' | 'candy/treats';

export type HouseholdItems =
    | 'bedding'
    | 'pillows'
    | 'plates'
    | 'cutlery'
    | 'pots and pans'
    | 'napkins/paper towels'
    | 'shower curtain';

export interface NoteFields {
    body: string;
    userId?: string;
    itemId?: string;
}
export interface ItemFields {
    clientId: string;
    category: ItemCategory;
    name: EngagementItems | HouseholdItems;
    requestorId: string;
    location: HouseLocation;
    quantity?: number;
    priority?: ItemPriority;
    status?: ItemStatus;
    note?: string;
}

export type UpdatableItemFields = Partial<ItemFields>;
