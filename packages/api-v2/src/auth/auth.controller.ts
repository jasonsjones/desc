import { Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthUtilsService } from '../utils/auth-utils.service';
import { AuthService } from './auth.service';
import { AuthUserResponse } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly authUtilsService: AuthUtilsService
    ) {}

    @ApiOkResponse({
        description: 'The user successfully authenticated.',
        type: AuthUserResponse
    })
    @ApiUnauthorizedResponse({
        description: 'The user failed to authenticate.'
    })
    @ApiBody({ type: LoginDto })
    @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    @Post('/login')
    async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const authUser = req.user;
        const refreshToken = this.authUtilsService.generateRefreshToken(authUser);
        this.authUtilsService.setAuthCookies(res, refreshToken);
        return await this.authService.login(authUser);
    }

    @ApiOkResponse({
        description: 'The user successfully logged out.'
    })
    @HttpCode(200)
    @Post('/logout')
    logout(@Req() _: Request, @Res({ passthrough: true }) res: Response) {
        res.clearCookie(AuthUtilsService.REFRESH_TOKEN_COOKIE_KEY);
        res.clearCookie(AuthUtilsService.AUTH_FLAG_COOKIE_KEY);
        return this.authService.logout();
    }

    @ApiOkResponse({
        description: 'A new access token was successfully re-issued.',
        type: AuthUserResponse
    })
    @Get('token')
    async fetchToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = this.authService.extractTokenFromCookie(req.cookies);
        const result = await this.authService.fetchToken(refreshToken);

        if (result.responsePayload.access_token && result.refreshToken) {
            this.authUtilsService.setAuthCookies(res, result.refreshToken);
        }

        return result.responsePayload;
    }
}
