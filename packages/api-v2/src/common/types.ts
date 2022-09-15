import { HouseLocation, ItemPriority, ItemStatus } from '@prisma/client';

type ClothingItems =
    | 'SHIRT'
    | 'COAT'
    | 'PANTS'
    | 'SHOES'
    | 'SOCKS'
    | 'UNDERWEAR'
    | 'BRA'
    | 'SCARF'
    | 'HATS'
    | 'OTHER';

type ClothingItemsObj = { [K in ClothingItems]: Lowercase<K> };

type EngagementItems = 'GAMES' | 'ARTWORK' | 'CANDY/TREATS' | 'OTHER';

type HouseholdItems =
    | 'BEDDING'
    | 'PILLOWS'
    | 'PLATES'
    | 'CUTLERY'
    | 'POTS AND PANS'
    | 'NAPKINS/PAPER TOWELS'
    | 'SHOWER CURTAIN'
    | 'OTHER';

type PersonalHygieneItems =
    | 'SOAP'
    | 'SHAMPOO'
    | 'CONDITIONER'
    | 'BRUSH/COMB'
    | 'TOOTHBRUSH'
    | 'TOOTHPASTE'
    | 'FLOSS'
    | 'FEMININE PAD'
    | 'TAMPONS'
    | 'TOILET PAPER'
    | 'OTHER';

type OtherItems = 'OTHER';

type PetItems = OtherItems;
type TicketItems = OtherItems;

type ShirtSizes =
    | 'XS (0/32)'
    | 'S (2-4/34-36)'
    | 'M (6-8/38-40)'
    | 'L (10-12/42-44)'
    | 'XL (14-16/46)'
    | 'XXL (18-20/48)'
    | 'XXXL (22-24/50)';

type CoatSizes =
    | 'XS (0/32)'
    | 'S (2-4/34-36)'
    | 'M (6-8/38-40)'
    | 'L (10-12/42-44)'
    | 'XL (14-16/46)'
    | 'XXL (18-20/48)'
    | 'XXXL (22-24/50)';

type PantSizes =
    | 'XS (25-26/28)'
    | 'S (27-29/30)'
    | 'M (30-32/32)'
    | 'L (33-37/34)'
    | 'XL (38-41/36)'
    | 'XXL (42-46/38)'
    | 'XXXL (47+/40+)';

type ShoeSizes =
    | "Women's 4"
    | "Women's 4.5"
    | "Women's 5"
    | "Women's 5.5"
    | "Women's 6"
    | "Women's 6.5"
    | "Women's 7"
    | "Women's 7.5"
    | "Women's 8"
    | "Women's 8.5"
    | "Women's 9"
    | "Women's 9.5"
    | "Women's 10"
    | "Women's 10.5"
    | "Women's 11"
    | "Women's 11.5"
    | "Women's 12"
    | "Men's 6"
    | "Men's 6.5"
    | "Men's 7"
    | "Men's 7.5"
    | "Men's 8"
    | "Men's 8.5"
    | "Men's 9"
    | "Men's 9.5"
    | "Men's 10"
    | "Men's 10.5"
    | "Men's 11"
    | "Men's 11.5"
    | "Men's 12"
    | "Men's 12.5"
    | "Men's 13"
    | "Men's 13.5"
    | "Men's 14"
    | "Men's 14.5"
    | "Men's 15"
    | "Men's 15.5"
    | "Men's 16";

type SockOrUnderwearSizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

type GloveSizes = 'S' | 'M' | 'L';

type BraSizes =
    | 'S (32-34, A-B)'
    | 'M (34-37, B-C)'
    | 'L (37-41, C-D)'
    | 'XL (40-43 D-E)'
    | 'XXXL (43+ D+)';

enum Category {
    CLOTHING = 'CLOTHING',
    ENGAGEMENT = 'ENGAGEMENT',
    HOUSEHOLD = 'HOUSEHOLD',
    PERSONAL_HYGIENE = 'PERSONAL_HYGIENE',
    PET = 'PET',
    TICKET = 'TICKET',
    OTHER = 'OTHER'
}

enum Clothing {
    SHIRT = 'SHIRT',
    COAT = 'COAT',
    PANTS = 'PANTS',
    SHOES = 'SHOES',
    SOCKS = 'SOCKS',
    UNDERWEAR = 'UNDERWEAR',
    BRA = 'BRA',
    GLOVES = 'GLOVES',
    SCARF = 'SCARF',
    HATS = 'HATS',
    OTHER = 'OTHER'
}

type ItemName<T extends Category> = T extends Category.CLOTHING
    ? ClothingItems
    : T extends Category.ENGAGEMENT
    ? EngagementItems
    : T extends Category.HOUSEHOLD
    ? HouseholdItems
    : T extends Category.PERSONAL_HYGIENE
    ? PersonalHygieneItems
    : T extends Category.PET
    ? PetItems
    : T extends Category.TICKET
    ? TicketItems
    : T extends Category.OTHER
    ? OtherItems
    : never;

type ItemSizeForItem<N extends Clothing> = N extends Clothing.SHIRT
    ? ShirtSizes
    : N extends Clothing.COAT
    ? CoatSizes
    : N extends Clothing.PANTS
    ? PantSizes
    : N extends Clothing.SHOES
    ? ShoeSizes
    : N extends Clothing.SOCKS | Clothing.UNDERWEAR
    ? SockOrUnderwearSizes
    : N extends Clothing.GLOVES
    ? GloveSizes
    : N extends Clothing.BRA
    ? BraSizes
    : N extends Clothing.OTHER
    ? string
    : undefined;

export interface BaseItem {
    clientId: string;
    userId: string;
    location: HouseLocation;
    quantity: number;
    priority?: ItemPriority;
    status?: ItemStatus;
    note?: string;
}

type NonClothingCategory = Exclude<Category, Category.CLOTHING>;

type NonClothingItem<Cat extends NonClothingCategory> = BaseItem & {
    category: Cat;
    name: ItemName<Cat>;
};

type ClothingItem<I extends Clothing> = BaseItem & {
    category: Category.CLOTHING;
    name: I;
    size: ItemSizeForItem<I>;
};

export type Item<T> = T extends Clothing
    ? ClothingItem<T>
    : T extends Category
    ? NonClothingItem<Exclude<Category, Category.CLOTHING>>
    : never;
