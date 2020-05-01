import { createPostgresConnection, closeConnection } from '../../config/database';
import User from '../../entity/User';
import { ItemCategory, HouseLocation, ItemFields, Program } from '../../common/types';
import UserService from '../../user/UserService';
import ClientRequestService from '../ClientRequestService';
import TestUtils from '../../testUtils/TestUtilities';

describe('ClientRequest service', () => {
    let userId: string;
    const clientId = '123456789';
    let item1: ItemFields;
    let item2: ItemFields;
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

        item1 = {
            clientId,
            category: ItemCategory.HOUSEHOLD,
            name: 'pillows',
            quantity: 2,
            location: HouseLocation.RAINIER_HOUSE,
            requestorId: userId
        };

        item2 = {
            clientId,
            category: ItemCategory.ENGAGEMENT,
            name: 'games',
            location: HouseLocation.AURORA_HOUSE,
            requestorId: userId,
            note: 'Board games are perfect'
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

    describe('createClientRequest() method', () => {
        it('creates a client request without any items', async () => {
            const cr = await ClientRequestService.createClientRequest({
                clientId,
                requestorId: userId
            });

            expect(cr).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId: expect.any(String),
                    submittedBy: expect.any(User),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                })
            );

            expect(cr).toEqual(expect.not.objectContaining({ items: expect.any(Object) }));
        });

        it('creates a client request when passed a single item', async () => {
            const cr = await ClientRequestService.createClientRequest({
                clientId,
                requestorId: userId,
                items: item2
            });

            expect(cr).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId: expect.any(String),
                    submittedBy: expect.any(User),
                    items: expect.arrayContaining([expect.any(Object)]),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                })
            );

            expect(cr.items).toHaveLength(1);
        });

        it('creates a client request when passed an array of items', async () => {
            const cr = await ClientRequestService.createClientRequest({
                clientId,
                requestorId: userId,
                items: [item1, item2]
            });

            expect(cr).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId: expect.any(String),
                    submittedBy: expect.any(User),
                    items: expect.arrayContaining([expect.any(Object)]),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                })
            );

            expect(cr.items).toHaveLength(2);
        });

        it('throws an error if the requestor is not found', async () => {
            expect.assertions(1);
            const unkownUserId = '4a29f793-ad0f-4388-9a40-0c0423c5b78c';

            try {
                await ClientRequestService.createClientRequest({
                    clientId,
                    requestorId: unkownUserId,
                    items: item1
                });
            } catch (e) {
                expect(e.message).toBe('Invalid requestor');
            }
        });
    });

    describe('getAllClientRequests() method', () => {
        beforeEach(async () => {
            await ClientRequestService.createClientRequest({
                clientId,
                requestorId: userId,
                items: [item1, item2]
            });
        });

        it('fetches all the client requests', async () => {
            const requests = await ClientRequestService.getAllClientRequests();

            expect(requests).toHaveLength(1);
            expect(requests).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        clientId: expect.any(String),
                        submittedBy: expect.any(User),
                        items: expect.arrayContaining([expect.any(Object), expect.any(Object)]),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    })
                ])
            );
        });
    });

    describe('getClientRequestById() method', () => {
        let clientRequestId: string;

        beforeEach(async () => {
            const cr = await ClientRequestService.createClientRequest({
                clientId,
                requestorId: userId,
                items: [item1, item2]
            });

            clientRequestId = cr.id;
        });

        it('fetches a client request by id', async () => {
            const cr = await ClientRequestService.getClientRequestById(clientRequestId);
            expect(cr).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId: expect.any(String),
                    submittedBy: expect.any(User),
                    items: expect.arrayContaining([expect.any(Object), expect.any(Object)]),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                })
            );
        });

        it('returns undefined if the client request with the given id is not found', async () => {
            const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
            const cr = await ClientRequestService.getClientRequestById(badId);
            expect(cr).toBeUndefined();
        });
    });
});
