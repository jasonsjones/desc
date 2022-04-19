import express from 'express';
import clientRequestController from './ClientRequestController';
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
            .post(isAuthenticated, clientRequestController.createClientRequest)
            .get(isAuthenticated, clientRequestController.getAllClientRequests);

        ClientRequestRouter.router
            .route('/:id')
            .get(isAuthenticated, clientRequestController.getClientRequest);
    }
}

export default ClientRequestRouter;
