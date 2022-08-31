import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    @ApiCreatedResponse({
        description: 'The user record has been successfully created.',
        type: User
    })
    async create(@Body() dto: CreateUserDto) {
        return await this.usersService.create(dto);
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
        return this.usersService.remove(id);
    }
}
