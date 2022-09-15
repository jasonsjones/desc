import { ItemCategory, HouseLocation } from '@prisma/client';
import { CreateClientRequestDto } from '../dto/create-client-request.dto';

const clientId = '987654';
const userId = '0dc67b2e-b833-4b65-a3aa-ea27dc6d5577';

export const payloadWithoutItems: CreateClientRequestDto = {
    clientId,
    userId
};

export const payloadWithSingleItem: CreateClientRequestDto = {
    clientId,
    userId,
    items: [
        {
            clientId,
            userId,
            category: ItemCategory.HOUSEHOLD,
            name: 'CUTLERY',
            quantity: 4,
            location: HouseLocation.EASTLAKE
        }
    ]
};

export const payloadWithItemsWithoutNotes: CreateClientRequestDto = {
    clientId,
    userId,
    items: [
        {
            clientId,
            userId,
            category: ItemCategory.HOUSEHOLD,
            name: 'CUTLERY',
            quantity: 4,
            location: HouseLocation.EASTLAKE
        },
        {
            clientId,
            userId,
            category: ItemCategory.HOUSEHOLD,
            name: 'POTS AND PANS',
            quantity: 2,
            location: HouseLocation.EASTLAKE
        }
    ]
};

export const payloadWithItemsAndNotes: CreateClientRequestDto = {
    clientId,
    userId,
    items: [
        {
            clientId,
            userId,
            category: ItemCategory.HOUSEHOLD,
            name: 'CUTLERY',
            quantity: 4,
            location: HouseLocation.EASTLAKE,
            note: {
                userId,
                body: 'This is a note for the cutlery'
            }
        },
        {
            clientId,
            userId,
            category: ItemCategory.HOUSEHOLD,
            name: 'POTS AND PANS',
            quantity: 2,
            location: HouseLocation.EASTLAKE,
            note: {
                userId,
                body: 'This is a note for the pots and pans'
            }
        }
    ]
};
