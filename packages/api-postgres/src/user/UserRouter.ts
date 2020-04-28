import express, { Request, Response, NextFunction } from 'express';
import UserController from './UserController';
import UserService from './UserService';
import { UserRole } from '../entity/User';

async function isAdmin(req: Request, _: Response, next: NextFunction): Promise<void> {
    if (req.user) {
        const id: string = (req.user as any).id;

        const authUser = await UserService.getUserById(id);
        if (authUser?.roles.includes(UserRole.ADMIN)) {
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
        UserRouter.router.route('/me').get(UserController.me);

        UserRouter.router
            .route('/')
            .post(UserController.createUser)
            .get(isAdmin, UserController.getAllUsers);

        UserRouter.router
            .route('/:id')
            .get(UserController.getUser)
            .patch(UserController.updateUser)
            .delete(UserController.deleteUser);
    }
}

export default UserRouter;
