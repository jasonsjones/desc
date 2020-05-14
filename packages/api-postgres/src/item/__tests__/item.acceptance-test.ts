import TestClient from '../../testUtils/TestClient';
import TestUtils from '../../testUtils/TestUtilities';
import { Program } from '../../common/types';
import { createPostgresConnection, closeConnection } from '../../config/database';
import { ItemPriority, ItemStatus, ItemCategory } from '../../common/types';

describe('Item route acceptance tests', () => {
    let requestor1Id: string;
    let requestor2Id: string;
    let adminClient: TestClient;
    let requestor1Client: TestClient;
    let requestor2Client: TestClient;
    const clientId = '123456789';

    const requestor1Email = 'oliver@desc.org';
    const requestor2Email = 'barry@desc.org';
    const adminEmail = 'admin@desc.org';
    const password = '123456';

    beforeAll(async () => {
        adminClient = new TestClient();
        requestor1Client = new TestClient();
        requestor2Client = new TestClient();

        await createPostgresConnection();

        await TestUtils.createAdminTestUser({
            firstName: 'Admin',
            lastName: 'User',
            email: adminEmail,
            password,
            program: Program.SURVIVAL
        });

        const user1 = await TestUtils.createTestUser({
            firstName: 'Oliver',
            lastName: 'Queen',
            email: requestor1Email,
            password,
            program: Program.SURVIVAL
        });
        requestor1Id = user1.id;

        const user2 = await TestUtils.createTestUser({
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
                await requestor1Client.doLogin(requestor1Email, password);
            });

            it('creates a new item', async () => {
                const response = await requestor1Client.createItem({
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

            it('creates a new personal hygiene item', async () => {
                const response = await requestor1Client.createItem({
                    clientId,
                    category: 'personal hygiene',
                    name: 'soap',
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
                const response = await requestor1Client.createItem({
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
                const response = await requestor1Client.createItem({
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
                const response = await requestor1Client.createItem({
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

            it('creates a new item after normalizing the data', async () => {
                const response = await requestor1Client.createItem({
                    clientId,
                    category: 'Household',
                    name: 'Plates',
                    quantity: 4,
                    location: 'Aurora House',
                    requestorId: requestor1Id,
                    note: 'This should STAY title case'
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

                const item = response.body.payload.item;
                expect(item.category).toEqual('household');
                expect(item.name).toEqual('plates');
                expect(item.location).toEqual('aurora house');
                expect(item.notes[0].body).toEqual('This should STAY title case');
            });

            it('responds with error if the item does not belong to the category', async () => {
                const response = await requestor1Client.createItem({
                    clientId,
                    category: 'engagement',
                    name: 'Plates',
                    quantity: 4,
                    location: 'aurora house',
                    requestorId: requestor1Id,
                    note: 'This should STAY title case'
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

            it('does not create an item if the user is not authenticated', async () => {
                requestor1Client.logoutUser();
                const response = await requestor1Client.createItem({
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
                await requestor1Client.doLogin(requestor1Email, password);

                await requestor1Client.createItem({
                    clientId,
                    category: 'engagement',
                    name: 'games',
                    location: 'aurora house',
                    requestorId: requestor1Id
                });

                await requestor1Client.createItem({
                    clientId,
                    category: 'household',
                    name: 'pillows',
                    location: 'aurora house',
                    requestorId: requestor2Id
                });

                await requestor1Client.createItem({
                    clientId,
                    category: 'household',
                    name: 'plates',
                    quantity: 4,
                    location: 'aurora house',
                    requestorId: requestor2Id
                });
            });

            it('fetches all the items', async () => {
                const response = await requestor1Client.getAllItems();

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: expect.any(String),
                        payload: expect.objectContaining({
                            items: expect.any(Object)
                        })
                    })
                );
                expect(response.body.payload.items).toHaveLength(3);
            });

            it('includes sanitized user info', async () => {
                const response = await requestor1Client.getAllItems();
                expect(response.body.payload.items[0].submittedBy.password).not.toBeDefined();
            });

            it('does not fetch items if the user is not authenticated', async () => {
                const response = await requestor2Client.getAllItems();

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

            it('fetches only the items from the given requestor', async () => {
                const response = await requestor1Client.getAllItemsByRequestor(requestor2Id);

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

            it('fetches all the items from the given category', async () => {
                const response = await requestor1Client.getAllItemsByQuery('category=household');

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

            it('ignores invalid query params and fetches all the items', async () => {
                const response = await requestor1Client.getAllItemsByQuery(
                    'unknownParam=bogusvalue'
                );

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: expect.any(String),
                        payload: expect.objectContaining({
                            items: expect.any(Object)
                        })
                    })
                );
                expect(response.body.payload.items).toHaveLength(3);
            });
        });
    });

    describe('api/items/:id route', () => {
        let requestor2ItemId: string;
        beforeEach(async () => {
            await requestor2Client.doLogin(requestor2Email, password);

            await requestor2Client.createItem({
                clientId,
                category: 'engagement',
                name: 'games',
                location: 'aurora house',
                requestorId: requestor1Id
            });

            const response = await requestor2Client.createItem({
                clientId,
                category: 'household',
                name: 'pillows',
                location: 'aurora house',
                requestorId: requestor2Id
            });
            requestor2ItemId = response.body.payload.item.id;
        });

        describe('GET request method', () => {
            it('fetches the item with the given id', async () => {
                const response = await requestor2Client.getItem(requestor2ItemId);

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
                const response = await requestor2Client.getItem(requestor2ItemId);
                expect(response.body.payload.item.submittedBy.password).not.toBeDefined();
            });

            it('with invalid item id returns a null item in the payload', async () => {
                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
                const response = await requestor2Client.getItem(badId);

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

            it('does not fetch item if the user is not authenticated', async () => {
                requestor2Client.logoutUser();
                const response = await requestor2Client.getItem(requestor2ItemId);

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
                const response = await requestor2Client.updateItem(requestor2ItemId, {
                    status: ItemStatus.APPROVED
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

            it('updates the name and category of the item with the given id', async () => {
                const response = await requestor2Client.updateItem(requestor2ItemId, {
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

            it('unable to update item requested by another user', async () => {
                await requestor1Client.doLogin(requestor1Email, password);

                const response = await requestor1Client.updateItem(requestor2ItemId, {
                    category: ItemCategory.ENGAGEMENT,
                    name: 'games'
                });

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

            it('with invalid item id returns a null item in the payload', async () => {
                // need to login as admin user to attempt to query unknown id
                await adminClient.doLogin(adminEmail, password);

                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
                const response = await adminClient.updateItem(badId, { quantity: 4 });

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

            it('does not update item if the user is not authenticated', async () => {
                requestor2Client.logoutUser();
                const response = await requestor2Client.updateItem(requestor2ItemId, {
                    priority: ItemPriority.URGENT
                });

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

        describe('DELETE request method', () => {
            it('deletes the item with the given id', async () => {
                const response = await requestor2Client.deleteItem(requestor2ItemId);

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
                const response = await requestor2Client.deleteItem(requestor2ItemId);
                expect(response.body.payload.item.submittedBy.password).not.toBeDefined();
            });

            it('with invalid item id returns a null item in the payload', async () => {
                // need to login as admin user to attempt to query unknown id
                await adminClient.doLogin(adminEmail, password);
                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';

                const response = await adminClient.deleteItem(badId);

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

            it('unable to delete item that was requested by another user', async () => {
                await requestor1Client.doLogin(requestor1Email, password);

                const response = await requestor1Client.deleteItem(requestor2ItemId);

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

            it('does not delete item if the user is not authenticated', async () => {
                requestor2Client.logoutUser();
                const response = await requestor2Client.deleteItem(requestor2ItemId);

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

    describe('api/items/:id/notes route', () => {
        let requestor2ItemId: string;
        beforeEach(async () => {
            // login to create items
            await adminClient.doLogin(adminEmail, password);

            await adminClient.createItem({
                clientId,
                category: 'engagement',
                name: 'games',
                location: 'aurora house',
                requestorId: requestor1Id
            });

            const response = await adminClient.createItem({
                clientId,
                category: 'household',
                name: 'pillows',
                location: 'aurora house',
                requestorId: requestor2Id,
                note: 'Big, fluffy pillows, please.'
            });

            requestor2ItemId = response.body.payload.item.id;
        });

        describe('POST request method', () => {
            it('adds a note to an item', async () => {
                await requestor1Client.doLogin(requestor1Email, password);

                const noteData = {
                    body: 'King size pillows, please.',
                    authorId: requestor1Id
                };

                const response = await requestor1Client.addNoteToItem(requestor2ItemId, noteData);

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
                // need to login as admin user to attempt to query unknown id
                await adminClient.doLogin(adminEmail, password);
                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';

                const noteData = {
                    body: 'King size pillows, please.',
                    authorId: requestor1Id
                };
                const response = await adminClient.addNoteToItem(badId, noteData);

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
                // need to login as admin user to attempt to query unknown id
                await adminClient.doLogin(adminEmail, password);
                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';

                const noteData = {
                    body: 'King size pillows, please.',
                    authorId: badId
                };
                const response = await adminClient.addNoteToItem(requestor2ItemId, noteData);

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

            it('does not add a note to an item if the user is not authenticated', async () => {
                requestor1Client.logoutUser();
                const noteData = {
                    body: 'King size pillows, please.',
                    authorId: requestor1Id
                };
                const response = await requestor1Client.addNoteToItem(requestor2ItemId, noteData);

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

    describe('api/items/:id/notes/:noteId route', () => {
        let requestor1ItemId: string;
        let requestor1NoteId: string;

        beforeEach(async () => {
            await requestor1Client.doLogin(requestor1Email, password);

            await requestor1Client.createItem({
                clientId,
                category: 'engagement',
                name: 'games',
                location: 'aurora house',
                requestorId: requestor1Id
            });

            const itemResponse = await requestor1Client.createItem({
                clientId,
                category: 'household',
                name: 'pillows',
                location: 'aurora house',
                requestorId: requestor1Id,
                note: 'Big, fluffy pillows, please.'
            });

            requestor1ItemId = itemResponse.body.payload.item.id;

            const noteData1 = {
                body: 'King size pillows, please.',
                authorId: requestor1Id
            };

            const noteData2 = {
                body: 'Correction: Queen size pillows, please.',
                authorId: requestor2Id
            };

            const noteResponse = await requestor1Client.addNoteToItem(requestor1ItemId, noteData1);
            requestor1NoteId = noteResponse.body.payload.item.notes[1].id;

            await requestor1Client.addNoteToItem(requestor1ItemId, noteData2);
        });

        describe('DELETE request method', () => {
            it('deletes a note from an item', async () => {
                const response = await requestor1Client.deleteNoteFromItem(
                    requestor1ItemId,
                    requestor1NoteId
                );

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
                // need to login as admin user to attempt to query unknown id
                await adminClient.doLogin(adminEmail, password);
                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
                const response = await adminClient.deleteNoteFromItem(badId, requestor1NoteId);

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
                // need to login as admin user to attempt to query unknown id
                await adminClient.doLogin(adminEmail, password);
                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
                const response = await adminClient.deleteNoteFromItem(requestor1ItemId, badId);

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

            it('does not delete a note made by another user', async () => {
                await requestor2Client.doLogin(requestor2Email, password);

                const response = await requestor2Client.deleteNoteFromItem(
                    requestor1ItemId,
                    requestor1NoteId
                );

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

            it('does not delete a note if the user is not authentciated', async () => {
                requestor1Client.logoutUser();

                const response = await requestor1Client.deleteNoteFromItem(
                    requestor1ItemId,
                    requestor1NoteId
                );

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
});
