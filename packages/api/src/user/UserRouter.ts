import express, { Request, Response, NextFunction } from 'express';
import userController from './UserController';
import userService from './UserService';
import { isAdmin, checkForRefreshToken } from '../common/routerMiddleware';

async function isAdminOrSelf(req: Request, _: Response, next: NextFunction): Promise<void> {
    if (req.user) {
        const id: string = (req.user as any).id;

        const authUser = await userService.getUserById(id);
        if (authUser?.isAdmin() || authUser?.isOwner(req.params.id)) {
            next();
        } else {
            next(new Error('Error: Insufficient access level'));
        }
    } else {
        next(new Error('Error: protected route, user needs to be authenticated.'));
    }
}

class UserRouter {
    private static router = express.Router();
    static getRouter(): express.Router {
        UserRouter.defineRoutes();
        return UserRouter.router;
    }

    private static defineRoutes(): void {
        UserRouter.router
            .route('/')
            .post(userController.createUser)
            .get(isAdmin, userController.getAllUsers);

        UserRouter.router.route('/me').get(checkForRefreshToken, userController.me);
        UserRouter.router.route('/forgotpassword').patch(userController.forgotPassword);

        UserRouter.router
            .route('/:id([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})')
            .get(isAdminOrSelf, userController.getUser)
            .patch(isAdminOrSelf, userController.updateUser)
            .delete(isAdminOrSelf, userController.deleteUser);

        UserRouter.router
            .route(
                '/:id([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/deactivate'
            )
            .post(isAdmin, userController.deactivateUser);

        UserRouter.router
            .route(
                '/:id([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/activate'
            )
            .post(isAdmin, userController.activateUser);

        UserRouter.router.route('/confirmemail/:token').patch(userController.confirmEmail);
        UserRouter.router.route('/changepassword/:token').patch(userController.changePassword);
    }
}

export default UserRouter;
