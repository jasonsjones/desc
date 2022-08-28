import { getNoteRepository } from '../common/entityUtils';
import { NoteFields } from '../common/types/notes';
import Note from '../entity/Note';
import itemService from '../item/ItemService';
import userService from '../user/UserService';

class NoteService {
    async createNote(noteData: NoteFields): Promise<Note | undefined> {
        const { body, userId, itemId } = noteData;
        const note = getNoteRepository().create({ body });

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

        return getNoteRepository().save(note);
    }

    createNoteForItem(noteData: NoteFields): Note {
        const { body } = noteData;
        const note = getNoteRepository().create({ body });
        return note;
    }

    getAllNotes(): Promise<Note[]> {
        return getNoteRepository().find({ relations: { submittedBy: true, item: true } });
    }

    getNoteById(id: string): Promise<Note | null> {
        return getNoteRepository().findOne({
            where: { id },
            relations: {
                submittedBy: true,
                item: true
            }
        });
    }

    getNoteForItem(itemId: string): Promise<Note[]> {
        return getNoteRepository().find({
            where: { item: { id: itemId } },
            relations: {
                submittedBy: true,
                item: true
            }
        });
    }

    async deleteNote(id: string): Promise<Note | null> {
        const note = await this.getNoteById(id);
        await getNoteRepository().delete({ id });
        return note;
    }
}

export default new NoteService();
