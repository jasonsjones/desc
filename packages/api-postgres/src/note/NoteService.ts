import Note from '../entity/Note';
import UserService from '../user/UserService';
import ItemService from '../item/ItemService';
import { NoteData } from '../common/types';

export default class NoteService {
    static async createNote(noteData: NoteData): Promise<Note | undefined> {
        const { body, userId, itemId } = noteData;
        const note = Note.create({ body });

        if (userId && itemId) {
            const user = await UserService.getUserById(userId);
            const item = await ItemService.getItemById(itemId);
            if (!user) {
                throw new Error('Invalid user');
            }

            if (!item) {
                throw new Error('Invalid item');
            }

            note.submittedBy = user;
            note.item = item;
        }

        return note.save();
    }

    static createNoteForItem(noteData: NoteData): Note {
        const { body } = noteData;
        const note = Note.create({ body });
        return note;
    }

    static getAllNotes(): Promise<Note[]> {
        return Note.find({ relations: ['submittedBy', 'item'] });
    }

    static getNoteById(id: string): Promise<Note | undefined> {
        return Note.findOne({ where: { id }, relations: ['submittedBy', 'item'] });
    }

    static getNoteForItem(itemId: string): Promise<Note[]> {
        return Note.find({ where: { item: itemId }, relations: ['submittedBy', 'item'] });
    }

    static async deleteNote(id: string): Promise<Note | undefined> {
        const note = await NoteService.getNoteById(id);
        await Note.delete({ id });
        return note;
    }
}
