import { Injectable } from '@nestjs/common';
import { Program } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUtilsService } from '../utils/auth-utils.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ProgramDisplayDto } from './dto/program-display.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService, private authUtilsService: AuthUtilsService) {}

    async create(dto: CreateUserDto) {
        const { firstName, lastName, email, password, program } = dto;
        const hash = await bcrypt.hash(password, 12);

        const user = await this.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                program,
                hashedPassword: {
                    create: {
                        hash
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
        return await this.prisma.user.findUnique({
            where: { email },
            include: { hashedPassword: true }
        });
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

    getPrograms(): ProgramDisplayDto[] {
        return [
            {
                value: Program.HOUSING_FIRST,
                displayValue: 'Housing First'
            },
            {
                value: Program.INTEGRATED_SERVICES,
                displayValue: 'Integrated Services'
            },
            {
                value: Program.SURVIVAL_SERVICES,
                displayValue: 'Survival Services'
            },
            {
                value: Program.HEALTH_SERVICES,
                displayValue: 'Health Services'
            },
            {
                value: Program.EMPLOYMENT_SERVICES,
                displayValue: 'Employment Services'
            },
            {
                value: Program.RESEARCH_INNOVATION,
                displayValue: 'Research & Innovation'
            }
        ];
    }
}
