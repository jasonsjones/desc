import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    Param,
    Patch,
    Post,
    Res
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthUserResponse } from '../auth/dto/auth-response.dto';
import { AuthUtilsService } from '../utils/auth-utils.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private authUtilsService: AuthUtilsService, private usersService: UsersService) {}

    @Post()
    @ApiCreatedResponse({
        description: 'The user record has been successfully created.',
        type: AuthUserResponse
    })
    @ApiBadRequestResponse({ description: 'The user record failed to be created.' })
    async create(@Body() dto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.usersService.loginOnCreate(dto);
        const { user } = result;
        if (!user) {
            throw new HttpException('User not created', 400);
        }
        const refreshToken = this.authUtilsService.generateRefreshToken(user);
        this.authUtilsService.setAuthCookies(res, refreshToken);
        return result;
    }

    @Get()
    @ApiOkResponse({ description: 'All users have been successfully fetched.', type: User })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({ description: 'The single user has been successfully fetched.', type: User })
    findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Patch(':id')
    @ApiOkResponse({ description: 'The single user has been successfully updated.', type: User })
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto);
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'The single user has been successfully deleted.', type: User })
    remove(@Param('id') id: string) {
        return this.usersService.removeById(id);
    }
}
