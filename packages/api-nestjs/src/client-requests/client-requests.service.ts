import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateItemDto } from '../items/dto/create-item.dto';
import { CreateNoteDto } from '../notes/dto/create-note.dto';
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
                items: {
                    create: normalizeItems
                }
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
                items: { create: normalizeItems }
            },
            include: {
                items: true
            }
        });
    }

    async removeById(id: string) {
        return await this.prisma.clientRequest.delete({ where: { id } });
    }

    private normalizeItemsForType(
        items: CreateItemDto[]
    ): Prisma.ItemUncheckedCreateWithoutRequestInput[] {
        let normalizedItems: Prisma.ItemUncheckedCreateWithoutRequestInput[];
        if (Array.isArray(items)) {
            normalizedItems = items.map((item) => {
                let normalizedNote: Prisma.NoteUncheckedCreateNestedManyWithoutItemInput;
                const { note, ...restOfFields } = item;
                if (note) {
                    normalizedNote = this.normalizeNoteForType(note);
                }
                return {
                    ...restOfFields,
                    notes: normalizedNote
                };
            });
        }
        return normalizedItems;
    }

    private normalizeNoteForType(
        note: Omit<CreateNoteDto, 'itemId'>
    ): Prisma.NoteUncheckedCreateNestedManyWithoutItemInput {
        const { body, userId } = note;
        if (body && userId) {
            return {
                create: {
                    body,
                    userId
                }
            };
        }
    }
}
