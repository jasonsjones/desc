import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HouseLocation, ItemCategory, Program } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ClientRequestService } from '../src/client-requests/client-requests.service';
import { CreateItemDto } from '../src/items/dto/create-item.dto';
import { ItemsService } from '../src/items/items.service';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UsersService } from '../src/users/users.service';

function generateItemforClient(clientId: string, requestorId: string): CreateItemDto {
    return {
        clientId,
        userId: requestorId,
        category: ItemCategory.HOUSEHOLD,
        name: 'PLATES',
        quantity: 2,
        location: HouseLocation.EVANS_HOUSE
    };
}

describe('ClientRequestsController (e2e)', () => {
    let app: INestApplication;
    let clientReqService: ClientRequestService;
    let itemsService: ItemsService;
    let usersService: UsersService;
    let userId: string;

    const clientId = '983456';

    const userData: CreateUserDto = {
        firstName: 'James',
        lastName: 'Gordon',
        email: 'james@desc.org',
        password: '123456',
        program: Program.INTEGRATED_SERVICES
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        usersService = moduleFixture.get<UsersService>(UsersService);
        itemsService = moduleFixture.get<ItemsService>(ItemsService);
        clientReqService = moduleFixture.get<ClientRequestService>(ClientRequestService);

        app = moduleFixture.createNestApplication();
        await app.init();

        const user = await usersService.create(userData);
        userId = user.id;
    });

    afterAll(async () => {
        await usersService.removeById(userId);
        await app.close();
    });

    describe('POST /client-requests', () => {
        let clientReqId: string;
        let itemId: string;
        let itemId2: string;

        afterEach(async () => {
            await clientReqService.removeById(clientReqId);
            if (itemId) {
                await itemsService.removeById(itemId);
            }
            if (itemId2) {
                await itemsService.removeById(itemId2);
            }
        });

        it('creates a new client request without any items', async () => {
            const response = await request(app.getHttpServer())
                .post('/client-requests')
                .set('Content-Type', 'application/json')
                .send({
                    clientId,
                    userId
                });

            const { body } = response;
            clientReqId = body.id;

            expect(body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId,
                    userId,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                })
            );
        });

        it('creates a new client request with items as a proper prisma type', async () => {
            const item = generateItemforClient(clientId, userId);
            const items = [item];

            const response = await request(app.getHttpServer())
                .post('/client-requests')
                .set('Content-Type', 'application/json')
                .send({
                    clientId,
                    userId,
                    items
                });

            const { body } = response;

            clientReqId = body.id;
            itemId = body.items[0].id;

            expect(body.items).toHaveLength(1);
            expect(body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId,
                    userId,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            id: itemId
                        })
                    ])
                })
            );
        });

        it('creates a new client request with an array of a single item', async () => {
            const item = generateItemforClient(clientId, userId);
            const items = [item];

            const response = await request(app.getHttpServer())
                .post('/client-requests')
                .set('Content-Type', 'application/json')
                .send({
                    clientId,
                    userId,
                    items
                });

            const { body } = response;

            clientReqId = body.id;
            itemId = body.items[0].id;

            expect(body.items).toHaveLength(1);
            expect(body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId,
                    userId,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(String)
                        })
                    ])
                })
            );
        });

        it('creates a new request with an array of many items', async () => {
            const item1 = generateItemforClient(clientId, userId);
            const item2 = generateItemforClient(clientId, userId);
            const items = [item1, item2];

            const response = await request(app.getHttpServer())
                .post('/client-requests')
                .set('Content-Type', 'application/json')
                .send({
                    clientId,
                    userId,
                    items
                });

            const { body } = response;

            clientReqId = body.id;
            itemId = body.items[0].id;
            itemId2 = body.items[1].id;

            expect(body.items).toHaveLength(2);
            expect(body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId,
                    userId,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(String)
                        })
                    ])
                })
            );
        });

        it('creates a new request with an array of many items with notes', async () => {
            const item1 = generateItemforClient(clientId, userId);
            const item2 = generateItemforClient(clientId, userId);
            item1.note = {
                body: 'A note for item 1',
                userId
            };
            item2.note = {
                body: 'A note for item 2',
                userId
            };
            const items = [item1, item2];
            const response = await request(app.getHttpServer())
                .post('/client-requests')
                .set('Content-Type', 'application/json')
                .send({
                    clientId,
                    userId,
                    items
                });

            const { body } = response;

            clientReqId = body.id;
            itemId = body.items[0].id;
            itemId2 = body.items[1].id;

            expect(body.items).toHaveLength(2);
            expect(body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId,
                    userId,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(String)
                        })
                    ])
                })
            );
        });
    });

    describe('GET /client-requests', () => {
        let clientReqId: string;
        let itemId: string;

        afterEach(async () => {
            await clientReqService.removeById(clientReqId);
            if (itemId) {
                await itemsService.removeById(itemId);
            }
        });

        it('returns all the client requests (with empty items)', async () => {
            const clientReq = await clientReqService.create({ clientId, userId });
            clientReqId = clientReq.id;

            const response = await request(app.getHttpServer()).get('/client-requests');
            const { body } = response;

            expect(body).toHaveLength(1);
            expect(body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        clientId,
                        userId,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                        items: []
                    })
                ])
            );
        });

        it('returns all the client requests (with items)', async () => {
            const item = generateItemforClient(clientId, userId);
            const items = [item];

            const clientReq = await clientReqService.create({
                clientId,
                userId,
                items
            });

            clientReqId = clientReq.id;
            const response = await request(app.getHttpServer()).get('/client-requests');
            const { body } = response;
            itemId = body[0].items[0].id;

            expect(body).toHaveLength(1);
            expect(body[0].items).toHaveLength(1);
            expect(body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        clientId,
                        userId,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                        items: expect.arrayContaining([
                            expect.objectContaining({
                                id: itemId,
                                clientId,
                                userId
                            })
                        ])
                    })
                ])
            );
        });
    });

    describe('GET /client-requests/:id', () => {
        let clientReqId: string;
        let itemId: string;

        afterEach(async () => {
            await clientReqService.removeById(clientReqId);
            if (itemId) {
                await itemsService.removeById(itemId);
            }
        });

        it('returns a single client request (with empty items) with the given id', async () => {
            const clientReq = await clientReqService.create({ clientId, userId });
            clientReqId = clientReq.id;

            const response = await request(app.getHttpServer()).get(
                `/client-requests/${clientReqId}`
            );
            const { body } = response;

            expect(body).toEqual(
                expect.objectContaining({
                    id: clientReqId,
                    clientId,
                    userId,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    items: []
                })
            );
        });

        it('returns a single client request (with items) with the given id', async () => {
            const item = generateItemforClient(clientId, userId);
            const items = [item];

            const clientReq = await clientReqService.create({
                clientId,
                userId,
                items
            });

            clientReqId = clientReq.id;

            const response = await request(app.getHttpServer()).get(
                `/client-requests/${clientReqId}`
            );
            const { body } = response;
            itemId = body.items[0].id;

            expect(body).toEqual(
                expect.objectContaining({
                    id: clientReqId,
                    clientId,
                    userId,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            id: itemId,
                            clientId,
                            userId
                        })
                    ])
                })
            );
        });
    });

    describe('PATCH /client-requests/:id', () => {
        let clientReqId: string;
        let itemId: string;
        let itemId2: string;

        afterEach(async () => {
            await clientReqService.removeById(clientReqId);
            if (itemId) {
                await itemsService.removeById(itemId);
            }

            if (itemId2) {
                await itemsService.removeById(itemId2);
            }
        });

        it('adds the first item to an empty client request', async () => {
            const clientReq = await clientReqService.create({
                clientId,
                userId
            });

            clientReqId = clientReq.id;
            const item = generateItemforClient(clientId, userId);
            const items = [item];

            const response = await request(app.getHttpServer())
                .patch(`/client-requests/${clientReqId}`)
                .set('Content-Type', 'application/json')
                .send({ items });

            const { body } = response;

            itemId = body.items[0].id;

            expect(body).toEqual(
                expect.objectContaining({
                    id: clientReqId,
                    clientId,
                    userId,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            id: itemId,
                            clientId,
                            userId
                        })
                    ])
                })
            );
        });

        it('adds an additional item to an client request', async () => {
            const item = generateItemforClient(clientId, userId);
            const items = [item];

            const clientReq = await clientReqService.create({
                clientId,
                userId,
                items
            });

            clientReqId = clientReq.id;
            const moreItems = [generateItemforClient(clientId, userId)];
            const response = await request(app.getHttpServer())
                .patch(`/client-requests/${clientReqId}`)
                .set('Content-Type', 'application/json')
                .send({ items: moreItems });

            const { body } = response;

            expect(body.items).toHaveLength(2);
            itemId = body.items[0].id;
            itemId2 = body.items[1].id;

            expect(body).toEqual(
                expect.objectContaining({
                    id: clientReqId,
                    clientId,
                    userId,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            id: itemId,
                            clientId,
                            userId
                        })
                    ])
                })
            );
        });
    });

    describe('DELETE /client-requests/:id', () => {
        it('deletes the client request with the given id', async () => {
            const clientReq = await clientReqService.create({
                clientId,
                userId
            });

            const clientReqId = clientReq.id;
            const response = await request(app.getHttpServer()).delete(
                `/client-requests/${clientReqId}`
            );

            const { body } = response;
            expect(body).toEqual(
                expect.objectContaining({
                    id: clientReqId,
                    clientId,
                    userId,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                })
            );
        });
    });
});
