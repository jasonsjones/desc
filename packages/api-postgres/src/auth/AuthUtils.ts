import { Request } from 'express';
import jwt from 'jsonwebtoken';
import User from '../entity/User';

class AuthUtils {
    static getTokens = (req: Request): { token: string; refreshToken: string } => {
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

    static createAccessToken = (user: User): string => {
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

    static createRefreshToken = (user: User): string => {
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

    static verifyAccessToken = (token: string): string | object => {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    };

    static verifyRefreshToken = (token: string): string | object => {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
    };
}

export default AuthUtils;
