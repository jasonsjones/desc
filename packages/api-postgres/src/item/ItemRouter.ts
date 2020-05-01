import express, { Request, Response, NextFunction } from 'express';
import ItemController from './ItemController';
import ItemService from './ItemService';
import UserService from '../user/UserService';
import { isAuthenticated } from '../common/routerMiddleware';
import NoteService from '../note/NoteService';

async function isAdminOrRequestor(req: Request, _: Response, next: NextFunction): Promise<void> {
    if (req.user) {
        const id: string = (req.user as any).id;

        const authUser = await UserService.getUserById(id);
        const item = await ItemService.getItemById(req.params.id);

        if (authUser?.isAdmin() || authUser?.isOwner(item?.submittedBy.id)) {
            next();
        } else {
            next(new Error('Error: Insufficient access level'));
        }
    } else {
        next(new Error('Error: protected route, user needs to be authenticated.'));
    }
}

async function isAdminOrAuthor(req: Request, _: Response, next: NextFunction): Promise<void> {
    if (req.user) {
        const id: string = (req.user as any).id;

        const authUser = await UserService.getUserById(id);
        const note = await NoteService.getNoteById(req.params.noteId);

        if (authUser?.isAdmin() || authUser?.isOwner(note?.submittedBy.id)) {
            next();
        } else {
            next(new Error('Error: Insufficient access level'));
        }
    } else {
        next(new Error('Error: protected route, user needs to be authenticated.'));
    }
}

class ItemRouter {
    private static router = express.Router();

    static getRouter(): express.Router {
        ItemRouter.defineRoutes();
        return ItemRouter.router;
    }

    private static defineRoutes(): void {
        ItemRouter.router
            .route('/')
            .post(isAuthenticated, ItemController.createItem)
            .get(isAuthenticated, ItemController.getAllItems);

        ItemRouter.router
            .route('/:id')
            .get(isAuthenticated, ItemController.getItem)
            .patch(isAdminOrRequestor, ItemController.updateItem)
            .delete(isAdminOrRequestor, ItemController.deleteItem);

        ItemRouter.router.route('/:id/notes').post(isAuthenticated, ItemController.addNoteToItem);
        ItemRouter.router
            .route('/:id/notes/:noteId')
            .delete(isAdminOrAuthor, ItemController.deleteNoteFromItem);
    }
}

export default ItemRouter;
