import User from '../entity/User';
import LocalStrategy from './strategies/local';
import userService from '../user/UserService';
import { PassportStatic } from 'passport';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
    namespace Express {
        interface User {
            id: string;
            email: string;
        }
    }
}

export const passportConfig = (passport: PassportStatic): void => {
    passport.serializeUser((user: Express.User, done: (err: any, id?: string) => void) => {
        done(null, user.id);
    });

    passport.deserializeUser((id: string, done: (err: any, user?: User) => void) => {
        return userService
            .getUserById(id)
            .then((user) => {
                if (user) {
                    return done(null, user);
                }
            })
            .catch((err) => done(err));
    });
    passport.use('local', LocalStrategy);
};
