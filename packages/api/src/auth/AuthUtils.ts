import { Request } from 'express';
import jwt from 'jsonwebtoken';
import User from '../entity/User';

class AuthUtils {
    getTokens = (req: Request): { token: string; refreshToken: string } => {
        let bearerToken = null;
        if (req.headers.authorization) {
            bearerToken = req.headers.authorization.split(' ')[1];
        }

        const token = bearerToken as string;
        const refreshToken = req.cookies && req.cookies['qid'];

        return {
            token,
            refreshToken
        };
    };

    createAccessToken = (user: User): string => {
        const token = jwt.sign(
            {
                sub: user.id,
                email: user.email
            },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: '15m' }
        );
        return token;
    };

    createRefreshToken = (user: User): string => {
        const token = jwt.sign(
            {
                sub: user.id,
                email: user.email,
                version: user.refreshTokenVersion
            },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '7d' }
        );
        return token;
    };

    verifyAccessToken = (token: string): string => {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as string;
    };

    verifyRefreshToken = (token: string): string => {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as string;
    };
}

export default new AuthUtils();
