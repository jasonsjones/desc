import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateItemDto) {
        // if (dto.category === 'CLOTHING' && dto.name !== 'HATS' && !dto.size) {
        //     throw new BadRequestException('size is required for clothing items');
        // }

        const { note, ...restOfFields } = dto;

        const item = await this.prisma.item.create({
            data: {
                ...restOfFields,
                notes: {
                    create: note
                }
            },
            include: {
                notes: true
            }
        });

        return item;
    }

    async findAll() {
        return await this.prisma.item.findMany({});
    }

    async findById(id: string) {
        return await this.prisma.item.findUnique({ where: { id } });
    }

    async update(id: string, dto: UpdateItemDto) {
        const { note, ...restOfFields } = dto;

        return await this.prisma.item.update({
            where: { id },
            data: {
                ...restOfFields,
                notes: {
                    create: note
                }
            },
            include: {
                notes: true
            }
        });
    }

    async removeById(id: string) {
        return await this.prisma.item.delete({ where: { id } });
    }
}
