import express from 'express';
import ClientRequestController from './ClientRequestController';
import { isAuthenticated } from '../common/routerMiddleware';

class ClientRequestRouter {
    private static router = express.Router();

    static getRouter(): express.Router {
        ClientRequestRouter.defineRoutes();
        return ClientRequestRouter.router;
    }

    private static defineRoutes(): void {
        ClientRequestRouter.router
            .route('/')
            .post(isAuthenticated, ClientRequestController.createClientRequest)
            .get(ClientRequestController.getAllClientRequests);

        ClientRequestRouter.router.route('/:id').get(ClientRequestController.getClientRequest);
    }
}

export default ClientRequestRouter;
