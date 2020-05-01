import TestClient from '../../testUtils/TestClient';
import TestUtils from '../../testUtils/TestUtilities';
import { createPostgresConnection, closeConnection } from '../../config/database';
import { Program } from '../../entity/User';
import { ItemData, ItemCategory, HouseLocation } from '../../common/types';

describe('ClientRequest route acceptance tests', () => {
    const clientId = '123456789';
    const requestor1Email = 'oliver@desc.org';
    const adminEmail = 'Admin@desc.org';
    const password = '123456';
    let requestor1Id: string;
    let client: TestClient;
    let item1: ItemData;
    let item2: ItemData;
    let item3: ItemData;

    beforeAll(async () => {
        client = new TestClient();

        await createPostgresConnection();
        await client.createAdminTestUser({
            firstName: 'Admin',
            lastName: 'User',
            email: adminEmail,
            password,
            program: Program.EMPLOYMENT
        });

        const user1 = await client.createTestUser({
            firstName: 'Oliver',
            lastName: 'Queen',
            email: requestor1Email,
            password,
            program: Program.SURVIVAL
        });
        requestor1Id = user1.id;

        item1 = {
            clientId,
            category: ItemCategory.HOUSEHOLD,
            name: 'pillows',
            quantity: 2,
            location: HouseLocation.RAINIER_HOUSE,
            requestorId: requestor1Id
        };

        item2 = {
            clientId,
            category: ItemCategory.ENGAGEMENT,
            name: 'games',
            location: HouseLocation.AURORA_HOUSE,
            requestorId: requestor1Id,
            note: 'Board games are perfect'
        };

        item3 = {
            clientId,
            category: ItemCategory.HOUSEHOLD,
            name: 'bedding',
            location: HouseLocation.AURORA_HOUSE,
            requestorId: requestor1Id,
            note: '400 count sheets'
        };
    });

    afterEach(async () => {
        await TestUtils.dropNotes();
        await TestUtils.dropItems();
        await TestUtils.dropClientRequests();
    });

    afterAll(async () => {
        await TestUtils.dropUsers();
        await closeConnection();
    });

    describe('/api/clientrequests route', () => {
        describe('POST request method', () => {
            afterEach(() => {
                client.logoutUser();
            });

            it('creates a new client reqeust', async () => {
                await client.doLogin(requestor1Email, password);

                const response = await client.createClientRequest({
                    clientId,
                    requestorId: requestor1Id,
                    items: [item1, item2]
                });

                expect(response.status).toBe(201);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: 'client request created',
                        payload: expect.objectContaining({
                            clientRequest: expect.any(Object)
                        })
                    })
                );
            });

            it('creates a new client reqeust without items', async () => {
                await client.doLogin(requestor1Email, password);

                const response = await client.createClientRequest({
                    clientId,
                    requestorId: requestor1Id
                });

                expect(response.status).toBe(201);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: 'client request created',
                        payload: expect.objectContaining({
                            clientRequest: expect.any(Object)
                        })
                    })
                );
            });

            it('responds with error if clientId is not provided', async () => {
                await client.doLogin(requestor1Email, password);

                const response = await client.createClientRequest({
                    requestorId: requestor1Id,
                    items: [item1, item2]
                });

                expect(response.status).toBe(200);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'error creating client request',
                        payload: expect.objectContaining({
                            error: expect.any(String),
                            clientRequest: null
                        })
                    })
                );
            });

            it('responds with error if requestorId is not provided', async () => {
                await client.doLogin(requestor1Email, password);

                const response = await client.createClientRequest({
                    clientId,
                    items: [item1, item2]
                });

                expect(response.status).toBe(200);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'error creating client request',
                        payload: expect.objectContaining({
                            error: expect.any(String),
                            clientRequest: null
                        })
                    })
                );
            });

            it('responds with error if requestorId is not found', async () => {
                // login as admin to query an unknown id
                await client.doLogin(adminEmail, password);
                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';

                const response = await client.createClientRequest({
                    clientId,
                    requestorId: badId,
                    items: [item1, item2]
                });

                expect(response.status).toBe(200);
                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'error creating client request',
                        payload: expect.objectContaining({
                            error: expect.any(String),
                            clientRequest: null
                        })
                    })
                );
            });

            it('responds with error if the requestor is not authenticated', async () => {
                const response = await client.createClientRequest({
                    clientId,
                    requestorId: requestor1Id,
                    items: [item1, item2]
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
            beforeAll(async () => {
                await client.doLogin(requestor1Email, password);

                await client.createClientRequest({
                    clientId,
                    requestorId: requestor1Id,
                    items: [item1, item2]
                });

                await client.createClientRequest({
                    clientId,
                    requestorId: requestor1Id,
                    items: [item1, item3]
                });
                client.logoutUser();
            });

            it('fetches all client requests', async () => {
                await client.doLogin(requestor1Email, password);

                const response = await client.getAllClientRequests();

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: 'client requests fetched',
                        payload: expect.objectContaining({
                            clientRequests: expect.arrayContaining([
                                expect.any(Object),
                                expect.any(Object)
                            ])
                        })
                    })
                );
            });

            it('responds with error if the requestor is not authenticated', async () => {
                client.logoutUser();

                const response = await client.getAllClientRequests();

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

    describe('/api/clientrequests/:id route', () => {
        describe('GET request method', () => {
            let clientRequestId: string;

            beforeAll(async () => {
                await client.doLogin(requestor1Email, password);
                await client.createClientRequest({
                    clientId,
                    requestorId: requestor1Id,
                    items: [item1, item2]
                });

                const response = await client.createClientRequest({
                    clientId,
                    requestorId: requestor1Id,
                    items: [item1, item3]
                });

                clientRequestId = response.body.payload.clientRequest.id;
                client.logoutUser();
            });

            it('fetches the client request with the given id', async () => {
                await client.doLogin(requestor1Email, password);
                const response = await client.getClientRequest(clientRequestId);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: true,
                        message: 'client request fetched',
                        payload: expect.objectContaining({
                            clientRequest: expect.any(Object)
                        })
                    })
                );
            });

            it('with invalid client reuqest id returns a null client request in the payload', async () => {
                // login as admin to query an unknown id
                await client.doLogin(adminEmail, password);

                const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
                const response = await client.getClientRequest(badId);

                expect(response.body).toEqual(
                    expect.objectContaining({
                        success: false,
                        message: 'client request not found',
                        payload: expect.objectContaining({
                            clientRequest: null
                        })
                    })
                );
            });

            it('responds with error if the requestor is not authenticated', async () => {
                client.logoutUser();

                const response = await client.getClientRequest(clientRequestId);

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
