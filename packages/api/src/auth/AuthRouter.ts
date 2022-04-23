import express from 'express';
import authController from './AuthController';
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
            .post(passport.authenticate('local'), authController.login);

        AuthRouter.router.get('/logout', authController.logout);
        AuthRouter.router.get('/refreshToken', authController.getRefreshToken);
    }
}

export default AuthRouter;
