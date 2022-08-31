import bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

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

    async findAll() {
        return await this.prisma.user.findMany();
    }

    async findById(id: string) {
        return await this.prisma.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email } });
    }

    async update(id: string, dto: UpdateUserDto) {
        return await this.prisma.user.update({
            where: { id },
            data: dto
        });
    }

    async remove(id: string) {
        return await this.prisma.user.delete({ where: { id } });
    }
}
