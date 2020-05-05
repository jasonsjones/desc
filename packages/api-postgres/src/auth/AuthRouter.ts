import express from 'express';
import AuthController from './AuthController';
import { PassportStatic } from 'passport';

class AuthRouter {
    private static router = express.Router();
    static getRouter(passport: PassportStatic): express.Router {
        AuthRouter.defineRoutes(passport);
        return AuthRouter.router;
    }

    private static defineRoutes(passport: PassportStatic): void {
        AuthRouter.router
            .route('/login')
            .post(passport.authenticate('local'), AuthController.login);

        AuthRouter.router.get('/logout', AuthController.logout);
        AuthRouter.router.get('/refreshToken', AuthController.getRefreshToken);
    }
}

export default AuthRouter;
