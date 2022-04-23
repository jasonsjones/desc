import { Request, Response, NextFunction } from 'express';
import authUtils from './AuthUtils';
import User from '../entity/User';
import userService from '../user/UserService';

class AuthController {
    login(req: Request, res: Response): Response {
        const user = req.user as User;

        res.cookie('qid', authUtils.createRefreshToken(user), { httpOnly: true });
        const accessToken = authUtils.createAccessToken(user);

        return res.json({
            success: true,
            message: 'user authenticated',
            payload: {
                user: user.toClientJSON(),
                accessToken
            }
        });
    }

    logout(_: Request, res: Response): Response {
        res.clearCookie('qid');
        return res.json({
            success: true,
            message: 'user logged out',
            payload: null
        });
    }

    async getRefreshToken(req: Request, res: Response): Promise<Response> {
        const currentToken = req.cookies['qid'];

        if (!currentToken) {
            return this.sendEmptyAccessToken(res);
        }

        let user: User;
        try {
            const tokenPayload: any = authUtils.verifyRefreshToken(currentToken);
            user = (await userService.getUserById(tokenPayload.sub)) as User;
            if (!user) {
                return this.sendEmptyAccessToken(res);
            }

            if (user && tokenPayload.version === user.refreshTokenVersion) {
                res.cookie('qid', authUtils.createRefreshToken(user), { httpOnly: true });
                return res.json({
                    success: true,
                    message: 'new access token issued',
                    payload: {
                        user: user.toClientJSON(),
                        accessToken: authUtils.createAccessToken(user)
                    }
                });
            }
        } catch (err) {
            return this.sendEmptyAccessToken(res);
        }

        return res.json({
            success: false,
            message: 'unable to issue new access token',
            payload: null
        });
    }

    // Middleware methods and utilities

    processToken = async (req: Request, _: Response, next: NextFunction): Promise<void> => {
        const { token, refreshToken } = authUtils.getTokens(req);
        if (token && refreshToken) {
            try {
                const decoded: any = authUtils.verifyAccessToken(token);
                if (decoded) {
                    req.user = {
                        id: decoded.sub,
                        email: decoded.email
                    };
                } else {
                    req.user = undefined;
                }
            } catch (err) {
                if (err.name === 'TokenExpiredError') {
                    console.log('access token is expired.');
                }
            }
        } else {
            req.user = undefined;
        }
        next();
    };

    private sendEmptyAccessToken = (res: Response): Response => {
        return res.json({
            success: true,
            message: 'new access token requested.',
            payload: {
                accessToken: ''
            }
        });
    };
}

export default new AuthController();
