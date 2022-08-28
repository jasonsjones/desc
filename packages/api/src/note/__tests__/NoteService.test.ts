import { createPostgresConnection, closeConnection } from '../../config/database';
import userService from '../../user/UserService';
import { ItemCategory, HouseLocation, Program } from '../../common/types/enums';
import TestUtils from '../../testUtils/TestUtilities';
import itemService from '../../item/ItemService';
import noteService from '../NoteService';

describe('Note service', () => {
    let userId: string;
    let itemId: string;

    beforeAll(async () => {
        await createPostgresConnection();
        userId = (
            await userService.createUser({
                firstName: 'Test',
                lastName: 'User',
                email: 'test@desc.org',
                password: '123456',
                program: Program.SURVIVAL
            })
        ).id;

        const games = await itemService.createItem({
            clientId: '967865',
            category: ItemCategory.ENGAGEMENT,
            name: 'games',
            location: HouseLocation.AURORA_HOUSE,
            requestorId: userId
        });

        itemId = games?.id as string;
    });

    afterAll(async () => {
        // order matters
        await TestUtils.dropItems();
        await TestUtils.dropUsers();
        await closeConnection();
    });

    describe('createNote() method', () => {
        afterEach(async () => {
            await TestUtils.dropNotes();
        });

        it('creates a new note', async () => {
            const note = await noteService.createNote({ body: 'This is a test', userId, itemId });

            expect(note).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    body: expect.any(String),
                    submittedBy: expect.any(Object),
                    item: expect.any(Object)
                })
            );
        });

        it('throws error if user id is invalid', async () => {
            expect.assertions(1);
            const invalidUserId = '5a75038a-05e6-404b-8f5f-8bba3fed11f6';
            try {
                await noteService.createNote({
                    body: 'This should throw error',
                    userId: invalidUserId,
                    itemId
                });
            } catch (e) {
                expect(e.message).toBe('Invalid user');
            }
        });

        it('throws error if item id is invalid', async () => {
            expect.assertions(1);
            const invalidItemId = 'ad259d3d-3386-4df1-904f-0218b6f6891c';
            try {
                await noteService.createNote({
                    body: 'This should throw error',
                    userId,
                    itemId: invalidItemId
                });
            } catch (e) {
                expect(e.message).toBe('Invalid item');
            }
        });
    });

    describe('createNoteForItem() method', () => {
        it('creates a new note', () => {
            const note = noteService.createNoteForItem({ body: 'This is a test', userId, itemId });

            expect(note).toEqual(
                expect.objectContaining({
                    body: expect.any(String)
                })
            );

            expect(note).not.toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    submittedBy: expect.any(Object),
                    item: expect.any(Object)
                })
            );
        });
    });

    describe('getAllNotes() method', () => {
        beforeEach(async () => {
            await noteService.createNote({ body: 'This is the first test note', userId, itemId });
            await noteService.createNote({ body: 'This is the second test note', userId, itemId });
        });

        afterEach(async () => {
            await TestUtils.dropNotes();
        });

        it('fetches all notes', async () => {
            const notes = await noteService.getAllNotes();
            expect(notes).toHaveLength(2);
            expect(notes).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        body: expect.any(String),
                        submittedBy: expect.any(Object),
                        item: expect.any(Object)
                    })
                ])
            );
        });
    });

    describe('getNoteById() method', () => {
        let noteId: string;
        beforeEach(async () => {
            const note = await noteService.createNote({
                body: 'This is the first test note',
                userId,
                itemId
            });
            await noteService.createNote({ body: 'This is the second test note', userId, itemId });

            noteId = note?.id as string;
        });

        afterEach(async () => {
            await TestUtils.dropNotes();
        });

        it('fetches the item with the given id', async () => {
            const note = await noteService.getNoteById(noteId);
            expect(note).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    body: expect.any(String),
                    submittedBy: expect.any(Object),
                    item: expect.any(Object)
                })
            );
        });

        it('returns null if the note with the given id is not found', async () => {
            const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
            const note = await noteService.getNoteById(badId);
            expect(note).toBeNull();
        });
    });

    describe('getNoteForItem() method', () => {
        beforeAll(async () => {
            await noteService.createNote({
                body: 'This is the first test note',
                userId,
                itemId
            });
            await noteService.createNote({ body: 'This is the second test note', userId, itemId });
        });

        afterAll(async () => {
            await TestUtils.dropNotes();
        });

        it('fetches all the notes for an item', async () => {
            const notes = await noteService.getNoteForItem(itemId);
            expect(notes).toHaveLength(2);
            expect(notes).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        body: expect.any(String),
                        submittedBy: expect.any(Object),
                        item: expect.any(Object)
                    })
                ])
            );
        });

        it('returns empty array if the item is not found', async () => {
            const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
            const note = await noteService.getNoteForItem(badId);
            expect(note).toHaveLength(0);
        });
    });

    describe('deleteNote() method', () => {
        let noteId: string;
        beforeEach(async () => {
            const note = await noteService.createNote({
                body: 'This is the first test note',
                userId,
                itemId
            });
            await noteService.createNote({ body: 'This is the second test note', userId, itemId });

            noteId = note?.id as string;
        });

        afterEach(async () => {
            await TestUtils.dropNotes();
        });

        it('deletes the item with the given id', async () => {
            const note = await noteService.deleteNote(noteId);

            expect(note).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    body: expect.any(String)
                })
            );

            const remainingNotes = await noteService.getAllNotes();
            expect(remainingNotes).toHaveLength(1);
        });

        it('returns null if the note with the given id is not found', async () => {
            const badId = '80453b6b-d1af-4142-903b-3ba9f92e7f39';
            const note = await noteService.deleteNote(badId);
            expect(note).toBeNull();
        });
    });
});
