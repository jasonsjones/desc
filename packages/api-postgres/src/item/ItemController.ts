import { Request, Response } from 'express';
import ItemService from './ItemService';

class ItemController {
    static createItem(req: Request, res: Response): Promise<Response> {
        const normalizedData = ItemController.normalizeData(req.body);

        const {
            clientId,
            category,
            name,
            priority,
            quantity,
            status,
            location,
            requestorId,
            note
        } = normalizedData;

        return ItemService.createItem({
            clientId,
            category,
            name,
            priority,
            quantity,
            status,
            location,
            requestorId,
            note
        })
            .then((item) => {
                // need to remove the reference to the item in the note since it causes a circular reference
                // and JSON does not handle it
                if (item && item.notes && item.notes.length > 0) {
                    delete item.notes[0].item;
                }

                return res.status(201).json({
                    success: true,
                    message: 'item created',
                    payload: {
                        item: item?.toClientJSON()
                    }
                });
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error creating new item',
                    payload: {
                        error: err.message,
                        item: null
                    }
                });
            });
    }

    static getAllItems(_: Request, res: Response): Promise<Response> {
        return ItemService.getAllItems()
            .then((items) => {
                let sanitizedItems;
                if (items) {
                    sanitizedItems = items.map((item) => item.toClientJSON());
                }
                return res.json({
                    success: true,
                    message: 'items fetched',
                    payload: {
                        items: sanitizedItems
                    }
                });
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error fetching items',
                    payload: {
                        error: err.message,
                        items: null
                    }
                });
            });
    }

    static getItem(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        return ItemService.getItemById(id)
            .then((item) => {
                if (item) {
                    return res.json({
                        success: true,
                        message: 'item fetched',
                        payload: { item: item.toClientJSON() }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'item not found',
                        payload: { item: null }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error fetching item',
                    payload: {
                        error: err.message,
                        item: null
                    }
                });
            });
    }

    static updateItem(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        const updateData = req.body;
        return ItemService.updateItem(id, updateData)
            .then((item) => {
                if (item) {
                    return res.json({
                        success: true,
                        message: 'item updated',
                        payload: { item: item.toClientJSON() }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'item not found',
                        payload: { item: null }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error updating item',
                    payload: {
                        error: err.message,
                        item: null
                    }
                });
            });
    }

    static deleteItem(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        return ItemService.deleteItem(id)
            .then((item) => {
                if (item) {
                    return res.json({
                        success: true,
                        message: 'item deleted',
                        payload: { item: item.toClientJSON() }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'item not found',
                        payload: { item: null }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error deleting item',
                    payload: {
                        error: err.message,
                        item: null
                    }
                });
            });
    }

    static addNoteToItem(req: Request, res: Response): Promise<Response> {
        const itemId = req.params.id;
        const { body, authorId } = req.body;
        return ItemService.addNoteToItem({ body, itemId, authorId })
            .then((item) => {
                if (item) {
                    return res.json({
                        success: true,
                        message: 'note added to item',
                        payload: { item }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'note note added to item',
                        payload: { item: null }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error adding note to item',
                    payload: {
                        error: err.message,
                        item: null
                    }
                });
            });
    }

    static deleteNoteFromItem(req: Request, res: Response): Promise<Response> {
        const itemId = req.params.id;
        const noteId = req.params.noteId;

        return ItemService.deleteNoteFromItem({ noteId, itemId })
            .then((item) => {
                if (item) {
                    return res.json({
                        success: true,
                        message: 'note deleted from item',
                        payload: { item }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'unable to delete note from item',
                        payload: { item: null }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error deleting note from item',
                    payload: {
                        error: err.message,
                        item: null
                    }
                });
            });
    }

    private static normalizeData(payload: any): any {
        let data: any = {};

        for (let key in payload) {
            if (typeof payload[key] === 'string' && key !== 'note') {
                data[key] = payload[key].toLowerCase();
            } else {
                data[key] = payload[key];
            }
        }
        return data;
    }
}

export default ItemController;
