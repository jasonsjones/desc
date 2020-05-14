import ItemService from '../ItemService';
import { createPostgresConnection, closeConnection } from '../../config/database';
import User from '../../entity/User';
import { ItemCategory, ItemPriority, ItemStatus, HouseLocation, Program } from '../../common/types';
import UserService from '../../user/UserService';
import TestUtils from '../../testUtils/TestUtilities';
import NoteService from '../../note/NoteService';

describe('Item service', () => {
    let userId: string;
    const clientId = '123456789';

    beforeAll(async () => {
        await createPostgresConnection();
        userId = (
            await UserService.createUser({
                firstName: 'Test',
                lastName: 'User',
                email: 'test@desc.org',
                password: '123456',
                program: Program.SURVIVAL
            })
        ).id;
    });

    afterEach(async () => {
        await TestUtils.dropNotes();
        await TestUtils.dropItems();
    });

    afterAll(async () => {
        await TestUtils.dropUsers();
        await closeConnection();
    });

    describe('createItem() method', () => {
        it('creates a new engagement item', async () => {
            const itemName = 'games';
            const item = await ItemService.createItem({
                clientId,
                category: ItemCategory.ENGAGEMENT,
                name: itemName,
                location: HouseLocation.AURORA_HOUSE,
                requestorId: userId
            });

            expect(item).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    category: 'engagement',
                    priority: 'standard',
                    quantity: 1,
                    name: itemName,
                    submittedBy: expect.any(User),
                    status: 'active',
                    location: 'aurora house'
                })
            );
        });

        it('creates a new household item', async () => {
            const item = await ItemService.createItem({
                clientId,
                category: ItemCategory.HOUSEHOLD,
                name: 'pillows',
                quantity: 2,
                location: HouseLocation.RAINIER_HOUSE,
                requestorId: userId
            });

            expect(item).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    category: 'household',
                    priority: 'standard',
                    quantity: 2,
                    name: 'pillows',
                    submittedBy: expect.any(User),
                    status: 'active',
                    location: 'rainier house'
                })
            );
        });

        it('creates a new personal hygiene item', async () => {
            const item = await ItemService.createItem({
                clientId,
                category: ItemCategory.PERSONAL_HYGIENE,
                name: 'toothpaste',
                quantity: 2,
                location: HouseLocation.RAINIER_HOUSE,
                requestorId: userId
            });

            expect(item).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    category: 'personal hygiene',
                    priority: 'standard',
                    quantity: 2,
                    name: 'toothpaste',
                    submittedBy: expect.any(User),
                    status: 'active',
                    location: 'rainier house'
                })
            );
        });

        it('creates a new urgent household item', async () => {
            const item = await ItemService.createItem({
                clientId,
                category: ItemCategory.HOUSEHOLD,
                name: 'pillows',
                priority: ItemPriority.URGENT,
                quantity: 2,
                location: HouseLocation.CLEMENT_PLACE,
                requestorId: userId
            });

            expect(item).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    category: 'household',
                    name: 'pillows',
                    priority: 'urgent',
                    quantity: 2,
                    submittedBy: expect.any(User),
                    status: 'active',
                    location: 'clement place'
                })
            );
        });

        it('creates a new urgent household item with a note', async () => {
            const item = await ItemService.createItem({
                clientId,
                category: ItemCategory.HOUSEHOLD,
                name: 'pillows',
                priority: ItemPriority.URGENT,
                quantity: 2,
                location: HouseLocation.CLEMENT_PLACE,
                requestorId: userId,
                note: 'This item is very urgent!'
            });

            expect(item).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    category: 'household',
                    name: 'pillows',
                    priority: 'urgent',
                    quantity: 2,
                    submittedBy: expect.any(User),
                    status: 'active',
                    location: 'clement place',
                    notes: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(String),
                            body: 'This item is very urgent!'
                        })
                    ])
                })
            );
        });

        it('creates a new household item with wishlist status', async () => {
            const item = await ItemService.createItem({
                clientId,
                category: ItemCategory.HOUSEHOLD,
                name: 'pillows',
                status: ItemStatus.WISHLIST,
                quantity: 2,
                location: HouseLocation.AURORA_HOUSE,
                requestorId: userId
            });

            expect(item).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    category: 'household',
                    name: 'pillows',
                    priority: 'standard',
                    quantity: 2,
                    submittedBy: expect.any(User),
                    status: 'wishlist',
                    location: 'aurora house'
                })
            );
        });

        it('throws an error if the requestor is not found', async () => {
            expect.assertions(1);
            const unkownUserId = '4a29f793-ad0f-4388-9a40-0c0423c5b78c';
            try {
                await ItemService.createItem({
                    clientId,
                    category: ItemCategory.HOUSEHOLD,
                    name: 'bedding',
                    location: HouseLocation.AURORA_HOUSE,
                    requestorId: unkownUserId
                });
            } catch (e) {
                expect(e.message).toBe('Invalid requestor');
            }
        });
    });

    describe('getAllItems() method', () => {
        beforeEach(async () => {
            await ItemService.createItem({
                clientId,
                category: ItemCategory.ENGAGEMENT,
                name: 'games',
                location: HouseLocation.EASTLAKE,
                requestorId: userId
            });
            await ItemService.createItem({
                clientId,
                category: ItemCategory.HOUSEHOLD,
                name: 'bedding',
                quantity: 2,
                location: HouseLocation.AURORA_HOUSE,
                requestorId: userId
            });
        });

        it('fetches all the items', async () => {
            const items = await ItemService.getAllItems();

            expect(items).toHaveLength(2);
            expect(items).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        category: expect.any(String),
                        name: expect.any(String),
                        quantity: expect.any(Number),
                        submittedBy: expect.any(User),
                        status: 'active',
                        location: expect.any(String)
                    })
                ])
            );
        });
    });

    describe('getItemById() method', () => {
        let itemId: string;
        beforeEach(async () => {
            const games = await ItemService.createItem({
                clientId,
                category: ItemCategory.ENGAGEMENT,
                name: 'games',
                location: HouseLocation.AURORA_HOUSE,
                requestorId: userId
            });

            itemId = games?.id as string;
        });

        it('fetches the item with the given id', async () => {
            const item = await ItemService.getItemById(itemId);

            expect(item).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    category: 'engagement',
                    name: 'games',
                    quantity: 1,
                    submittedBy: expect.any(User),
                    status: 'active'
                })
            );
        });

        it('returns undefined if the item with the given id is not found', async () => {
            const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
            const item = await ItemService.getItemById(badId);
            expect(item).toBeUndefined();
        });
    });

    describe('updateItem() method', () => {
        let itemId: string;
        const unknownId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';

        beforeEach(async () => {
            const games = await ItemService.createItem({
                clientId,
                category: ItemCategory.HOUSEHOLD,
                name: 'pillows',
                quantity: 2,
                location: HouseLocation.AURORA_HOUSE,
                requestorId: userId
            });

            itemId = games?.id as string;
        });

        it('updates the status of the item with the given id', async () => {
            const updatedItem = await ItemService.updateItem(itemId, {
                status: ItemStatus.APPROVED
            });

            expect(updatedItem).toEqual(
                expect.objectContaining({
                    status: 'approved'
                })
            );
        });

        it('updates the priority of the item with the given id', async () => {
            const updatedItem = await ItemService.updateItem(itemId, {
                priority: ItemPriority.URGENT
            });

            expect(updatedItem).toEqual(
                expect.objectContaining({
                    priority: 'urgent'
                })
            );
        });

        it('updates the quantity of the item with the given id', async () => {
            const updatedItem = await ItemService.updateItem(itemId, {
                quantity: 4
            });

            expect(updatedItem).toEqual(
                expect.objectContaining({
                    quantity: 4
                })
            );
        });

        it('updates the name and category of the item with the given id', async () => {
            const updatedItem = await ItemService.updateItem(itemId, {
                category: ItemCategory.ENGAGEMENT,
                name: 'games'
            });
            expect(updatedItem).toEqual(
                expect.objectContaining({
                    category: 'engagement',
                    name: 'games'
                })
            );
        });

        it('updates the location of the item with the given id', async () => {
            const updatedItem = await ItemService.updateItem(itemId, {
                location: HouseLocation.EASTLAKE
            });
            expect(updatedItem).toEqual(
                expect.objectContaining({
                    location: 'eastlake'
                })
            );
        });

        it('returns undefined if attemmpts to update item  with unknown id', async () => {
            const updatedItem = await ItemService.updateItem(unknownId, {
                category: ItemCategory.ENGAGEMENT,
                name: 'games'
            });

            expect(updatedItem).toBeUndefined();
        });
    });

    describe('deleteItem() method', () => {
        let itemId: string;
        beforeEach(async () => {
            const games = await ItemService.createItem({
                clientId,
                category: ItemCategory.ENGAGEMENT,
                name: 'games',
                location: HouseLocation.AURORA_HOUSE,
                requestorId: userId
            });

            itemId = games?.id as string;
        });

        it('deletes the item with the given id', async () => {
            const item = await ItemService.deleteItem(itemId);

            expect(item).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    category: 'engagement',
                    name: 'games',
                    submittedBy: expect.any(User)
                })
            );

            const items = await ItemService.getAllItems();
            expect(items).toHaveLength(0);
        });

        it('deletes the item with the given id and cascades the delete for the note', async () => {
            expect.assertions(1);

            const item = await ItemService.createItem({
                clientId,
                category: ItemCategory.HOUSEHOLD,
                name: 'pillows',
                priority: ItemPriority.URGENT,
                quantity: 2,
                location: HouseLocation.CLEMENT_PLACE,
                requestorId: userId,
                note: 'This item is very urgent!'
            });

            if (item) {
                await ItemService.deleteItem(item.id);
                const notes = await NoteService.getNoteForItem(item.id);
                expect(notes).toHaveLength(0);
            }
        });
    });

    describe('addNoteToItem() method', () => {
        let itemId: string;
        beforeEach(async () => {
            const games = await ItemService.createItem({
                clientId,
                category: ItemCategory.ENGAGEMENT,
                name: 'games',
                location: HouseLocation.AURORA_HOUSE,
                requestorId: userId,
                note: 'This is the first note to go with the request.'
            });

            itemId = games?.id as string;
        });

        it('adds a note to an existing item', async () => {
            const updatedItem = await ItemService.addNoteToItem({
                body: 'This is the second note to go with the request',
                authorId: userId,
                itemId
            });

            expect(updatedItem).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    category: 'engagement',
                    name: 'games',
                    quantity: 1,
                    submittedBy: expect.any(User),
                    status: 'active',
                    location: 'aurora house',
                    notes: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(String),
                            body: expect.any(String),
                            submittedBy: expect.any(User)
                        })
                    ])
                })
            );

            expect(updatedItem?.notes).toHaveLength(2);
        });

        it('throws an error if the author is not found', async () => {
            expect.assertions(1);
            const unkownUserId = '4a29f793-ad0f-4388-9a40-0c0423c5b78c';

            try {
                await ItemService.addNoteToItem({
                    body: 'Adding a note here',
                    authorId: unkownUserId,
                    itemId
                });
            } catch (e) {
                expect(e.message).toBe('Invalid author');
            }
        });

        it('throws an error if the item is not found', async () => {
            expect.assertions(1);
            const unknownItemId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
            try {
                await ItemService.addNoteToItem({
                    body: 'Adding a note here',
                    authorId: userId,
                    itemId: unknownItemId
                });
            } catch (e) {
                expect(e.message).toBe('Invalid item');
            }
        });
    });

    describe('deleteNoteFromItem() method', () => {
        let itemId: string;
        let noteId: string;

        beforeEach(async () => {
            const games = await ItemService.createItem({
                clientId,
                category: ItemCategory.ENGAGEMENT,
                name: 'games',
                location: HouseLocation.AURORA_HOUSE,
                requestorId: userId,
                note: 'This is the first note to go with the request.'
            });
            itemId = games?.id as string;

            const itemWith2Notes = await ItemService.addNoteToItem({
                body: 'This is the second note to go with the request',
                authorId: userId,
                itemId
            });

            noteId = itemWith2Notes?.notes[0].id as string;
        });

        it('deletes a note from the item', async () => {
            const itemWith1Note = await ItemService.deleteNoteFromItem({ noteId, itemId });

            expect(itemWith1Note).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    category: 'engagement',
                    name: 'games',
                    quantity: 1,
                    submittedBy: expect.any(User),
                    status: 'active',
                    location: 'aurora house',
                    notes: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(String),
                            body: expect.any(String),
                            submittedBy: expect.any(User)
                        })
                    ])
                })
            );

            expect(itemWith1Note?.notes).toHaveLength(1);
        });

        it('throws an error if the item is not found', async () => {
            expect.assertions(1);
            const unkownItemId = '4a29f793-ad0f-4388-9a40-0c0423c5b78c';

            try {
                await ItemService.deleteNoteFromItem({
                    noteId,
                    itemId: unkownItemId
                });
            } catch (e) {
                expect(e.message).toBe('Invalid item');
            }
        });

        it('throws an error if the note is not found', async () => {
            expect.assertions(1);
            const unkownNoteId = '4a29f793-ad0f-4388-9a40-0c0423c5b78c';

            try {
                await ItemService.deleteNoteFromItem({
                    noteId: unkownNoteId,
                    itemId
                });
            } catch (e) {
                expect(e.message).toBe('Invalid note');
            }
        });
    });
});
