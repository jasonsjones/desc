import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HouseLocation, ItemCategory } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateItemDto } from '../src/items/dto/create-item.dto';
import { ItemsService } from '../src/items/items.service';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UsersService } from '../src/users/users.service';

describe('ItemsController (e2e)', () => {
    let app: INestApplication;
    let itemsService: ItemsService;
    let usersService: UsersService;
    let userId: string;

    const userData: CreateUserDto = {
        firstName: 'James',
        lastName: 'Gordon',
        email: 'james@desc.org',
        password: '123456',
        program: 'HOUSING_FIRST'
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        itemsService = moduleFixture.get<ItemsService>(ItemsService);
        usersService = moduleFixture.get<UsersService>(UsersService);
        app = moduleFixture.createNestApplication();
        await app.init();

        const user = await usersService.create(userData);
        userId = user.id;
    });

    afterEach(async () => {
        await usersService.removeById(userId);
    });

    describe('/items (POST)', () => {
        let pillowId: string;
        let pillows: CreateItemDto;

        beforeEach(async () => {
            pillows = {
                clientId: '983456',
                category: ItemCategory.HOUSEHOLD,
                name: 'PILLOWS',
                quantity: 2,
                location: HouseLocation.EVANS_HOUSE,
                userId
            };
        });

        afterEach(async () => {
            await itemsService.removeById(pillowId);
        });

        it('creates a new houselhold item', async () => {
            const response = await request(app.getHttpServer())
                .post('/items')
                .set('Content-Type', 'application/json')
                .send(pillows);

            pillowId = response.body.id;

            expect(response.status).toBe(201);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId: pillows.clientId,
                    category: pillows.category,
                    name: pillows.name,
                    location: pillows.location,
                    quantity: pillows.quantity,
                    userId: userId,
                    status: 'ACTIVE',
                    priority: 'STANDARD'
                })
            );
        });

        it.todo('returns (400) Bad Request error if size is not provided with a CLOTHING item');
    });

    describe('/items (GET)', () => {
        let pillowId: string;
        let gamesId: string;

        beforeEach(async () => {
            const pillows = {
                clientId: '983456',
                category: ItemCategory.HOUSEHOLD,
                name: 'PILLOWS',
                quantity: 2,
                location: HouseLocation.EASTLAKE,
                userId
            };
            const games = {
                clientId: '983458',
                category: ItemCategory.ENGAGEMENT,
                name: 'GAMES',
                quantity: 2,
                location: HouseLocation.ESTELLE,
                userId
            };

            const item1 = await itemsService.create(pillows);
            const item2 = await itemsService.create(games);
            pillowId = item1.id;
            gamesId = item2.id;
        });

        afterEach(async () => {
            await itemsService.removeById(pillowId);
            await itemsService.removeById(gamesId);
        });

        it('returns all the items', async () => {
            const response = await request(app.getHttpServer()).get('/items');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        clientId: expect.any(String),
                        category: expect.any(String),
                        name: expect.any(String),
                        location: expect.any(String),
                        quantity: 2,
                        userId: userId,
                        status: 'ACTIVE',
                        priority: 'STANDARD'
                    })
                ])
            );
        });
    });

    describe('/items/:id (GET)', () => {
        let gamesId: string;

        beforeEach(async () => {
            const games = {
                clientId: '983458',
                category: ItemCategory.ENGAGEMENT,
                name: 'GAMES',
                quantity: 2,
                location: HouseLocation.ESTELLE,
                userId
            };

            const item2 = await itemsService.create(games);
            gamesId = item2.id;
        });

        afterEach(async () => {
            await itemsService.removeById(gamesId);
        });

        it('returns the item with the given id', async () => {
            const response = await request(app.getHttpServer()).get(`/items/${gamesId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId: expect.any(String),
                    category: ItemCategory.ENGAGEMENT,
                    name: 'GAMES',
                    location: HouseLocation.ESTELLE,
                    quantity: 2,
                    userId: userId,
                    status: 'ACTIVE',
                    priority: 'STANDARD'
                })
            );
        });
    });

    describe('/items/:id (PATCH)', () => {
        let itemId: string;

        beforeEach(async () => {
            const itemData = {
                clientId: '983456',
                category: ItemCategory.HOUSEHOLD,
                name: 'PILLOWS',
                quantity: 2,
                location: HouseLocation.EASTLAKE,
                userId
            };

            const item = await itemsService.create(itemData);
            itemId = item.id;
        });

        afterEach(async () => {
            await itemsService.removeById(itemId);
        });

        it('updates the item with the given id', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/items/${itemId}`)
                .set('Content-Type', 'application/json')
                .send({ name: 'BEDDING', quantity: 1 });

            expect(response.status).toEqual(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId: expect.any(String),
                    category: ItemCategory.HOUSEHOLD,
                    name: 'BEDDING',
                    location: HouseLocation.EASTLAKE,
                    quantity: 1,
                    userId: userId,
                    status: 'ACTIVE',
                    priority: 'STANDARD'
                })
            );
        });
    });

    describe('/items/:id (DELETE)', () => {
        let itemId: string;

        beforeEach(async () => {
            const itemData = {
                clientId: '983456',
                category: ItemCategory.HOUSEHOLD,
                name: 'PILLOWS',
                quantity: 2,
                location: HouseLocation.EASTLAKE,
                userId
            };

            const item = await itemsService.create(itemData);
            itemId = item.id;
        });

        it('deletes the item with the given id', async () => {
            const response = await request(app.getHttpServer())
                .delete(`/items/${itemId}`)
                .set('Content-Type', 'application/json')
                .send({ name: 'BEDDING', quantity: 1 });

            expect(response.status).toEqual(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId: expect.any(String),
                    category: ItemCategory.HOUSEHOLD,
                    name: 'PILLOWS',
                    location: HouseLocation.EASTLAKE,
                    quantity: 2,
                    userId: userId,
                    status: 'ACTIVE',
                    priority: 'STANDARD'
                })
            );
        });
    });
});
