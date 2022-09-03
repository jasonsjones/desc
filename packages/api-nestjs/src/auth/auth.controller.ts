import { Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthUtilsService } from '../utils/auth-utils.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly authUtilsService: AuthUtilsService
    ) {}

    @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    @Post('/login')
    async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const authUser = req.user;
        const refreshToken = this.authUtilsService.generateRefreshToken(authUser);
        this.authUtilsService.setAuthCookies(res, refreshToken);
        return await this.authService.login(authUser);
    }

    @HttpCode(200)
    @Post('/logout')
    logout(@Req() _: Request, @Res({ passthrough: true }) res: Response) {
        res.clearCookie(AuthUtilsService.REFRESH_TOKEN_COOKIE_KEY);
        res.clearCookie(AuthUtilsService.AUTH_FLAG_COOKIE_KEY);
        return this.authService.logout();
    }

    @Get('token')
    async fetchToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = this.authService.extractTokenFromCookie(req.cookies);
        const result = await this.authService.fetchToken(refreshToken);

        if (result.responsePayload.success && result.refreshToken) {
            this.authUtilsService.setAuthCookies(res, result.refreshToken);
        }

        return result.responsePayload;
    }
}
