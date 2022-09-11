import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientRequestDto } from './dto/create-client-request.dto';
import { UpdateClientRequestDto } from './dto/update-client-request.dto';

@Injectable()
export class ClientRequestService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateClientRequestDto) {
        const { clientId, userId, items } = dto;

        // normalize the items at runtime to make sure they will adhere to the
        // type prisma is expecting
        const normalizeItems = this.normalizeItemsForType(items);

        const request = await this.prisma.clientRequest.create({
            data: {
                clientId,
                userId,
                items: normalizeItems
            },
            include: {
                items: {
                    select: {
                        id: true
                    }
                }
            }
        });

        return request;
    }

    async findAll() {
        return await this.prisma.clientRequest.findMany({ include: { items: true } });
    }

    async findOneById(id: string) {
        return await this.prisma.clientRequest.findUnique({
            where: { id },
            include: { items: true }
        });
    }

    async updateById(id: string, dto: UpdateClientRequestDto) {
        const { clientId, userId, items } = dto;
        const normalizeItems = this.normalizeItemsForType(items);

        return await this.prisma.clientRequest.update({
            where: { id },
            data: {
                clientId,
                userId,
                items: normalizeItems
            },
            include: {
                items: true
            }
        });
    }

    async removeById(id: string) {
        return await this.prisma.clientRequest.delete({ where: { id } });
    }

    private normalizeItemsForType(items: unknown): Prisma.ItemCreateNestedManyWithoutRequestInput {
        return Array.isArray(items) ? { create: items } : items;
    }
}
