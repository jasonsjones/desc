import express, { Request, Response, NextFunction } from 'express';
import itemController from './ItemController';
import itemService from './ItemService';
import userService from '../user/UserService';
import { isAuthenticated } from '../common/routerMiddleware';
import NoteService from '../note/NoteService';

async function isAdminOrRequestor(req: Request, _: Response, next: NextFunction): Promise<void> {
    if (req.user) {
        const id: string = (req.user as any).id;

        const authUser = await userService.getUserById(id);
        const item = await itemService.getItemById(req.params.id);

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

        const authUser = await userService.getUserById(id);
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
            .post(isAuthenticated, itemController.createItem)
            .get(isAuthenticated, itemController.getAllItems);

        ItemRouter.router
            .route('/:id')
            .get(isAuthenticated, itemController.getItem)
            .patch(isAdminOrRequestor, itemController.updateItem)
            .delete(isAdminOrRequestor, itemController.deleteItem);

        ItemRouter.router.route('/:id/notes').post(isAuthenticated, itemController.addNoteToItem);
        ItemRouter.router
            .route('/:id/notes/:noteId')
            .delete(isAdminOrAuthor, itemController.deleteNoteFromItem);
    }
}

export default ItemRouter;
