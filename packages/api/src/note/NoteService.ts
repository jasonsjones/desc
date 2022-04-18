import Note from '../entity/Note';
import userService from '../user/UserService';
import itemService from '../item/ItemService';
import { NoteFields } from '../common/types/notes';
import { getEntityManager } from '../common/entityUtils';

export default class NoteService {
    static async createNote(noteData: NoteFields): Promise<Note | undefined> {
        const em = getEntityManager();
        const { body, userId, itemId } = noteData;
        const note = em.create(Note, { body });

        if (userId && itemId) {
            const user = await userService.getUserById(userId);
            const item = await itemService.getItemById(itemId);
            if (!user) {
                throw new Error('Invalid user');
            }

            if (!item) {
                throw new Error('Invalid item');
            }

            note.submittedBy = user;
            note.item = item;
        }

        return em.save(note);
    }

    static createNoteForItem(noteData: NoteFields): Note {
        const { body } = noteData;
        const note = getEntityManager().create(Note, { body });
        return note;
    }

    static getAllNotes(): Promise<Note[]> {
        return getEntityManager().find(Note, { relations: ['submittedBy', 'item'] });
    }

    static getNoteById(id: string): Promise<Note | undefined> {
        return getEntityManager().findOne(Note, {
            where: { id },
            relations: ['submittedBy', 'item']
        });
    }

    static getNoteForItem(itemId: string): Promise<Note[]> {
        return getEntityManager().find(Note, {
            where: { item: itemId },
            relations: ['submittedBy', 'item']
        });
    }

    static async deleteNote(id: string): Promise<Note | undefined> {
        const note = await NoteService.getNoteById(id);
        await getEntityManager().delete(Note, { id });
        return note;
    }
}
