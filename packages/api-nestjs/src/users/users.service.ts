import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUtilsService } from '../utils/auth-utils.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService, private authUtilsService: AuthUtilsService) {}

    async create(dto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 12);

        const user = await this.prisma.user.create({
            data: {
                ...dto,
                password: {
                    create: {
                        hash: hashedPassword
                    }
                }
            }
        });

        return user;
    }

    async loginOnCreate(dto: CreateUserDto) {
        const user = await this.create(dto);
        const token = this.authUtilsService.generateAccessToken(user);

        return {
            access_token: token,
            user
        };
    }

    async findAll() {
        return await this.prisma.user.findMany();
    }

    async findById(id: string) {
        return await this.prisma.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email } });
    }

    async findByEmailIncludePassword(email: string) {
        return await this.prisma.user.findUnique({ where: { email }, include: { password: true } });
    }

    async update(id: string, dto: UpdateUserDto) {
        return await this.prisma.user.update({
            where: { id },
            data: dto
        });
    }

    async removeById(id: string) {
        return await this.prisma.user.delete({ where: { id } });
    }

    async removeByEmail(email: string) {
        return await this.prisma.user.delete({ where: { email } });
    }
}
