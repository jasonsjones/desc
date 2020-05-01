import TestClient from '../../testUtils/TestClient';
import TestUtils from '../../testUtils/TestUtilities';
import { Program } from '../../entity/User';
import { createPostgresConnection, closeConnection } from '../../config/database';
import { ItemPriority, ItemStatus, ItemCategory } from '../../common/types';

describe('Item route acceptance tests', () => {
    let requestor1Id: string;
    let requestor2Id: string;
    let client: TestClient;
    const clientId = '123456789';

    const requestor1Email = 'oliver@desc.org';
    const requestor2Email = 'barry@desc.org';
    const adminEmail = 'admin@desc.org';
    const password = '123456';

    beforeAll(async () => {
        client = new TestClient();

        await createPostgresConnection();

        await client.createAdminTestUser({
            firstName: 'Admin',
            lastName: 'User',
            email: adminEmail,
            password,
            program: Program.SURVIVAL
        });

        const user1 = await client.createTestUser({
            firstName: 'Oliver',
            lastName: 'Queen',
            email: requestor1Email,
            password,
            program: Program.SURVIVAL
        });
        requestor1Id = user1.id;

        const user2 = await client.createTestUser({
            firstName: 'Barry',
            lastName: 'Allen',
            email: requestor2Email,
            password,
            program: Program.SURVIVAL
        });
        requestor2Id = user2.id;
    });

    afterEach(async () => {
        await TestUtils.dropNotes();
        await TestUtils.dropItems();
    });

    afterAll(async () => {
        await TestUtils.dropUsers();
        await closeConnection();
    });

    describe('/api/items route', () => {
        describe('POST request method', () => {
            beforeEach(async () => {
                await client.doLogin(requestor1Email, password);
            });

            it('creates a new item', async () => {
                const response = await client.createItem({
                    clientId,
                    category: 'engagement',
                    name: 'games',
                    location: 'aurora house',
                    requestorId: requestor1Id
                });

                expect(response.status).toBe(201);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: expect.any(String),
                        payload: expect.objectContaining({
                            item: expect.any(Object)
                        })
                    })
                );
            });

            it('creates a new item (3 quantities)', async () => {
                const response = await client.createItem({
                    clientId,
                    category: 'engagement',
                    name: 'games',
                    quantity: 3,
                    location: 'aurora house',
                    requestorId: requestor1Id
                });

                expect(response.status).toBe(201);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: expect.any(String),
                        payload: expect.objectContaining({
                            item: expect.any(Object)
                        })
                    })
                );
            });

            it('creates a new urgent item', async () => {
                const response = await client.createItem({
                    clientId,
                    category: 'engagement',
                    name: 'games',
                    location: 'aurora house',
                    priority: ItemPriority.URGENT,
                    requestorId: requestor1Id
                });

                expect(response.status).toBe(201);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: expect.any(String),
                        payload: expect.objectContaining({
                            item: expect.any(Object)
                        })
                    })
                );
            });

            it('creates a new wishlist item', async () => {
                const response = await client.createItem({
                    clientId,
                    category: 'engagement',
                    name: 'games',
                    status: ItemStatus.WISHLIST,
                    location: 'aurora house',
                    requestorId: requestor1Id
                });

                expect(response.status).toBe(201);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: expect.any(String),
                        payload: expect.objectContaining({
                            item: expect.any(Object)
                        })
                    })
                );
            });

            it('does not create an item if the user is not authenticated', async () => {
                client.logoutUser();
                const response = await client.createItem({
                    clientId,
                    category: 'engagement',
                    name: 'games',
                    status: ItemStatus.WISHLIST,
                    location: 'aurora house',
                    requestorId: requestor1Id
                });

                expect(response.status).toBe(200);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'Error: unable to complete request',
                        payload: {
                            error: expect.any(String)
                        }
                    })
                );
            });
        });

        describe('GET request method', () => {
            beforeEach(async () => {
                await client.doLogin(requestor1Email, password);

                await client.createItem({
                    clientId,
                    category: 'engagement',
                    name: 'games',
                    location: 'aurora house',
                    requestorId: requestor1Id
                });

                await client.createItem({
                    clientId,
                    category: 'household',
                    name: 'pillows',
                    location: 'aurora house',
                    requestorId: requestor2Id
                });
            });

            it('fetches all the items', async () => {
                const response = await client.getAllItems();

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: expect.any(String),
                        payload: expect.objectContaining({
                            items: expect.any(Object)
                        })
                    })
                );
                expect(response.body.payload.items).toHaveLength(2);
            });

            it('includes sanitized user info', async () => {
                const response = await client.getAllItems();
                expect(response.body.payload.items[0].submittedBy.password).not.toBeDefined();
            });

            it('does not fetch items if the user is not authenticated', async () => {
                client.logoutUser();
                const response = await client.getAllItems();

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'Error: unable to complete request',
                        payload: {
                            error: expect.any(String)
                        }
                    })
                );
            });
        });
    });

    describe('api/items/:id route', () => {
        let itemId: string;
        beforeEach(async () => {
            await client.doLogin(requestor2Email, password);

            await client.createItem({
                clientId,
                category: 'engagement',
                name: 'games',
                location: 'aurora house',
                requestorId: requestor1Id
            });

            const response = await client.createItem({
                clientId,
                category: 'household',
                name: 'pillows',
                location: 'aurora house',
                requestorId: requestor2Id
            });
            itemId = response.body.payload.item.id;
        });

        describe('GET request method', () => {
            it('fetches the item with the given id', async () => {
                const response = await client.getItem(itemId);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: 'item fetched',
                        payload: expect.objectContaining({
                            item: expect.any(Object)
                        })
                    })
                );
            });

            it('fetches the item with requestor data sanitized', async () => {
                const response = await client.getItem(itemId);
                expect(response.body.payload.item.submittedBy.password).not.toBeDefined();
            });

            it('with invalid item id returns a null item in the payload', async () => {
                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
                const response = await client.getItem(badId);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'item not found',
                        payload: expect.objectContaining({
                            item: null
                        })
                    })
                );
            });

            it('does not fetch items if the user is not authenticated', async () => {
                client.logoutUser();
                const response = await client.getItem(itemId);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'Error: unable to complete request',
                        payload: {
                            error: expect.any(String)
                        }
                    })
                );
            });
        });

        describe('PATCH request menthod', () => {
            it('updates the status of the item with the given id', async () => {
                const response = await client.updateItem(itemId, { status: ItemStatus.APPROVED });
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: 'item updated',
                        payload: expect.objectContaining({
                            item: expect.any(Object)
                        })
                    })
                );
            });

            it('updates the name and category of the item with the given id', async () => {
                const response = await client.updateItem(itemId, {
                    category: ItemCategory.ENGAGEMENT,
                    name: 'artwork'
                });
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: 'item updated',
                        payload: expect.objectContaining({
                            item: expect.any(Object)
                        })
                    })
                );
            });

            it('with invalid item id returns a null item in the payload', async () => {
                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
                const response = await client.updateItem(badId, { quantity: 4 });

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'item not found',
                        payload: expect.objectContaining({
                            item: null
                        })
                    })
                );
            });
        });

        describe('DELETE request method', () => {
            it('deletes the item with the given id', async () => {
                const response = await client.deleteItem(itemId);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: 'item deleted',
                        payload: expect.objectContaining({
                            item: expect.any(Object)
                        })
                    })
                );
            });

            it('deletes the item and returns with requestor data sanitized', async () => {
                const response = await client.deleteItem(itemId);
                expect(response.body.payload.item.submittedBy.password).not.toBeDefined();
            });

            it('with invalid item id returns a null item in the payload', async () => {
                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
                const response = await client.deleteItem(badId);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'item not found',
                        payload: expect.objectContaining({
                            item: null
                        })
                    })
                );
            });
        });
    });

    describe('api/items/:id/notes route', () => {
        let itemId: string;
        beforeEach(async () => {
            await client.doLogin(requestor1Email, password);

            await client.createItem({
                clientId,
                category: 'engagement',
                name: 'games',
                location: 'aurora house',
                requestorId: requestor1Id
            });

            const response = await client.createItem({
                clientId,
                category: 'household',
                name: 'pillows',
                location: 'aurora house',
                requestorId: requestor1Id,
                note: 'Big, fluffy pillows, please.'
            });

            itemId = response.body.payload.item.id;
        });

        describe('POST request method', () => {
            it('adds a note to an itme', async () => {
                const noteData = {
                    body: 'King size pillows, please.',
                    authorId: requestor1Id
                };
                const response = await client.addNoteToItem(itemId, noteData);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: 'note added to item',
                        payload: expect.objectContaining({
                            item: expect.any(Object)
                        })
                    })
                );
                expect(response.body.payload.item.notes).toHaveLength(2);
            });

            it('handles adding note to item with bad item id', async () => {
                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
                const noteData = {
                    body: 'King size pillows, please.',
                    authorId: requestor1Id
                };
                const response = await client.addNoteToItem(badId, noteData);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'error adding note to item',
                        payload: expect.objectContaining({
                            error: expect.any(String),
                            item: null
                        })
                    })
                );
            });

            it('handles adding note to item with bad author id', async () => {
                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
                const noteData = {
                    body: 'King size pillows, please.',
                    authorId: badId
                };
                const response = await client.addNoteToItem(itemId, noteData);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'error adding note to item',
                        payload: expect.objectContaining({
                            error: expect.any(String),
                            item: null
                        })
                    })
                );
            });
        });
    });

    describe('api/items/:id/notes/:noteId route', () => {
        let itemId: string;
        let noteId: string;

        beforeEach(async () => {
            await client.doLogin(requestor1Email, password);

            await client.createItem({
                clientId,
                category: 'engagement',
                name: 'games',
                location: 'aurora house',
                requestorId: requestor1Id
            });

            const itemResponse = await client.createItem({
                clientId,
                category: 'household',
                name: 'pillows',
                location: 'aurora house',
                requestorId: requestor1Id,
                note: {
                    body: 'Big, fluffy pillows, please.'
                }
            });

            itemId = itemResponse.body.payload.item.id;

            const noteData1 = {
                body: 'King size pillows, please.',
                authorId: requestor1Id
            };

            const noteData2 = {
                body: 'Queen size pillows, please.',
                authorId: requestor1Id
            };

            const noteResponse = await client.addNoteToItem(itemId, noteData1);
            noteId = noteResponse.body.payload.item.notes[1].id;

            await client.addNoteToItem(itemId, noteData2);
        });

        describe('DELETE request method', () => {
            it('deletes a note from an item', async () => {
                const response = await client.deleteNoteFromItem(itemId, noteId);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: 'note deleted from item',
                        payload: expect.objectContaining({
                            item: expect.any(Object)
                        })
                    })
                );
                expect(response.body.payload.item.notes).toHaveLength(2);
            });

            it('handles deleting a note to item with bad item id', async () => {
                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
                const response = await client.deleteNoteFromItem(badId, noteId);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'error deleting note from item',
                        payload: expect.objectContaining({
                            error: expect.any(String),
                            item: null
                        })
                    })
                );
            });

            it('handles deleting a note to item with bad note id', async () => {
                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
                const response = await client.deleteNoteFromItem(itemId, badId);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'error deleting note from item',
                        payload: expect.objectContaining({
                            error: expect.any(String),
                            item: null
                        })
                    })
                );
            });
        });
    });
});
