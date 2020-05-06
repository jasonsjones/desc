import { Request, Response, NextFunction } from 'express';
import UserService from '../user/UserService';
import AuthUtils from '../auth/AuthUtils';

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

export async function checkForRefreshToken(
    req: Request,
    _: Response,
    next: NextFunction
): Promise<void> {
    const { token, refreshToken } = AuthUtils.getTokens(req);

    // This is the likely scenario of a browser refresh after logging in.
    // No authenticated user or access token (token), but there is still the refresh token
    // which comes back as a cookie
    if (!req.user && !token && refreshToken) {
        try {
            const decodedPayload: any = AuthUtils.verifyRefreshToken(refreshToken);
            if (decodedPayload) {
                req.user = {
                    id: decodedPayload.sub,
                    email: decodedPayload.email
                };
            } else {
                req.user = undefined;
            }
        } catch (error) {
            req.user = undefined;
        }
    }
    next();
}
