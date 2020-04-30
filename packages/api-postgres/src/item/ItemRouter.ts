import express from 'express';
import ItemController from './ItemController';

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
            .get(ItemController.getAllItems);

        ItemRouter.router
            .route('/:id')
            .get(ItemController.getItem)
            .patch(ItemController.updateItem)
            .delete(ItemController.deleteItem);

        ItemRouter.router.route('/:id/notes').post(ItemController.addNoteToItem);
        ItemRouter.router.route('/:id/notes/:noteId').delete(ItemController.deleteNoteFromItem);
    }
}

export default ItemRouter;
