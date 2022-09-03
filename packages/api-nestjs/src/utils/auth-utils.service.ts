import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Response } from 'express';

@Injectable()
export class AuthUtilsService {
    constructor(private configService: ConfigService, private jwtService: JwtService) {}

    public static REFRESH_TOKEN_COOKIE_KEY = 'rid';
    public static AUTH_FLAG_COOKIE_KEY = 'authd';

    generateAccessToken(user: Partial<User>): string {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload, { expiresIn: '10m' });
    }

    generateRefreshToken(user: Partial<User>): string {
        const secret = this.configService.get<string>('REFRESH_TOKEN_SECRET');
        // TODO: add another piece of info to the payload; e.g. refreshTokenSerial no.
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload, { secret, expiresIn: '14d' });
    }

    verifyRefreshToken(token: string) {
        const secret = this.configService.get<string>('REFRESH_TOKEN_SECRET');
        return this.jwtService.verify(token, { secret });
    }

    setAuthCookies(res: Response, token: string) {
        res.cookie(AuthUtilsService.REFRESH_TOKEN_COOKIE_KEY, token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });

        // Add additional cookie that can be read by the client to be able to determine
        // the existence of the http only refresh token cookie.
        res.cookie(AuthUtilsService.AUTH_FLAG_COOKIE_KEY, true, {
            httpOnly: false,
            sameSite: 'none',
            secure: true
        });
    }
}
