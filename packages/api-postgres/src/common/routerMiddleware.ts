import { Request, Response, NextFunction } from 'express';
import UserService from '../user/UserService';

export async function isAdmin(req: Request, _: Response, next: NextFunction): Promise<void> {
    if (req.user) {
        const id: string = (req.user as any).id;

        const authUser = await UserService.getUserById(id);
        if (authUser?.isAdmin()) {
            next();
        } else {
            next(new Error('Error: Insufficient access level'));
        }
    } else {
        next(new Error('Error: protected route, user needs to be authenticated.'));
    }
}

export function isAuthenticated(req: Request, _: Response, next: NextFunction): void {
    if (req.user) {
        next();
    } else {
        next(new Error('Error: protected route, user needs to be authenticated.'));
    }
}
