import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HouseLocation, ItemCategory, Program } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ItemsService } from '../src/items/items.service';
import { CreateNoteDto } from '../src/notes/dto/create-note.dto';
import { NotesService } from '../src/notes/notes.service';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UsersService } from '../src/users/users.service';

describe('NotesController (e2e)', () => {
    let app: INestApplication;
    let itemsService: ItemsService;
    let notesService: NotesService;
    let usersService: UsersService;
    let userId: string;
    let itemId: string;

    const userData: CreateUserDto = {
        firstName: 'James',
        lastName: 'Gordon',
        email: 'james@desc.org',
        password: '123456',
        program: Program.INTEGRATED_SERVICES
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        itemsService = moduleFixture.get<ItemsService>(ItemsService);
        notesService = moduleFixture.get<NotesService>(NotesService);
        usersService = moduleFixture.get<UsersService>(UsersService);
        app = moduleFixture.createNestApplication();
        await app.init();

        const user = await usersService.create(userData);
        userId = user.id;
        const itemData = {
            clientId: '983456',
            category: ItemCategory.HOUSEHOLD,
            name: 'PLATES',
            quantity: 2,
            location: HouseLocation.EVANS_HOUSE,
            userId
        };
        const item = await itemsService.create(itemData);
        itemId = item.id;
    });

    afterEach(async () => {
        await itemsService.removeById(itemId);
        await usersService.removeById(userId);
    });

    describe('POST /notes', () => {
        let noteId: string;

        afterEach(async () => {
            await notesService.removeById(noteId);
        });

        it('creates a new note for an item', async () => {
            const noteData: CreateNoteDto = {
                body: 'A note for the item',
                itemId,
                userId
            };

            const response = await request(app.getHttpServer())
                .post('/notes')
                .set('Content-Type', 'application/json')
                .send(noteData);

            noteId = response.body.id;

            expect(response.status).toBe(201);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    body: noteData.body,
                    itemId,
                    userId
                })
            );
        });
    });

    describe('GET /notes', () => {
        let noteId: string;

        beforeEach(async () => {
            const note = await notesService.create({
                body: 'A nice note for the item',
                itemId,
                userId
            });
            noteId = note.id;
        });

        afterEach(async () => {
            await notesService.removeById(noteId);
        });

        it('returns all notes', async () => {
            const response = await request(app.getHttpServer()).get('/notes');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        body: expect.any(String),
                        itemId,
                        userId
                    })
                ])
            );
        });
    });

    describe('GET /notes/:id', () => {
        let noteId: string;

        beforeEach(async () => {
            const note = await notesService.create({
                body: 'A nice note for the item',
                itemId,
                userId
            });
            noteId = note.id;
        });

        afterEach(async () => {
            await notesService.removeById(noteId);
        });

        it('returns the single note with given id', async () => {
            const response = await request(app.getHttpServer()).get(`/notes/${noteId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    body: expect.any(String),
                    itemId,
                    userId
                })
            );
        });
    });

    describe('PATCH /notes/:id', () => {
        let noteId: string;
        const updatedBody = 'An updated note for the item';

        beforeEach(async () => {
            const note = await notesService.create({
                body: 'A nice note for the item',
                itemId,
                userId
            });
            noteId = note.id;
        });

        afterEach(async () => {
            await notesService.removeById(noteId);
        });

        it('updates the note with given id', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/notes/${noteId}`)
                .set('Content-Type', 'application/json')
                .send({ body: updatedBody });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    body: updatedBody,
                    itemId,
                    userId
                })
            );
        });
    });

    describe('DELETE /notes/:id', () => {
        let noteId: string;

        beforeEach(async () => {
            const note = await notesService.create({
                body: 'A nice note for the item',
                itemId,
                userId
            });
            noteId = note.id;
        });

        it('deletes the note with given id', async () => {
            const response = await request(app.getHttpServer()).delete(`/notes/${noteId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    body: expect.any(String),
                    itemId,
                    userId
                })
            );
        });
    });
});
