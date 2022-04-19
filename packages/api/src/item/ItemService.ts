import Item from '../entity/Item';
import { ItemFields, UpdatableItemFields } from '../common/types/items';
import userService from '../user/UserService';
import NoteService from '../note/NoteService';
import { getItemRepository } from '../common/entityUtils';

class ItemService {
    async createItem(itemData: ItemFields): Promise<Item> {
        const {
            clientId,
            category,
            name,
            size,
            priority,
            quantity,
            requestorId,
            status,
            location,
            note
        } = itemData;
        const requestor = await userService.getUserById(requestorId);

        if (!requestor) {
            throw new Error('Invalid requestor');
        }

        const item = getItemRepository().create({
            clientId,
            category,
            name,
            size,
            priority,
            quantity,
            status,
            location
        });
        item.submittedBy = requestor;

        if (note) {
            const tempNote = NoteService.createNoteForItem({ body: note });
            tempNote.submittedBy = requestor;
            tempNote.item = item;
            item.notes = [tempNote];
        }

        return getItemRepository().save(item);
    }

    getAllItems(query = {}): Promise<Item[]> {
        return getItemRepository().find({
            where: query,
            relations: ['submittedBy', 'notes', 'notes.submittedBy']
        });
    }

    getItemById(id: string): Promise<Item | undefined> {
        return getItemRepository().findOne({
            where: { id },
            relations: ['submittedBy', 'notes', 'notes.submittedBy']
        });
    }

    async updateItem(id: string, data: UpdatableItemFields): Promise<Item | undefined> {
        await getItemRepository().update({ id }, data);
        return this.getItemById(id);
    }

    async deleteItem(id: string): Promise<Item | undefined> {
        const item = await this.getItemById(id);
        await getItemRepository().delete({ id });
        return item;
    }

    async addNoteToItem(noteData: {
        body: string;
        itemId: string;
        authorId: string;
    }): Promise<Item | undefined> {
        const { body, itemId, authorId } = noteData;
        const author = await userService.getUserById(authorId);
        const item = await this.getItemById(itemId);

        if (!author) {
            throw new Error('Invalid author');
        }

        if (!item) {
            throw new Error('Invalid item');
        }

        const note = NoteService.createNoteForItem({ body });
        note.submittedBy = author;
        note.item = item;
        item.notes = [...item.notes, note];
        await getItemRepository().save(item);

        return this.getItemById(itemId);
    }

    async deleteNoteFromItem(noteData: {
        noteId: string;
        itemId: string;
    }): Promise<Item | undefined> {
        const { noteId, itemId } = noteData;
        const item = await this.getItemById(itemId);
        if (!item) {
            throw new Error('Invalid item');
        }
        const deletedNote = await NoteService.deleteNote(noteId);
        if (!deletedNote) {
            throw new Error('Invalid note');
        }
        item.notes = item?.notes.filter((note) => note.id !== noteId);

        return this.getItemById(itemId);
    }
}

export default new ItemService();
