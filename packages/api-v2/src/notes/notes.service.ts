import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateNoteDto) {
        const note = this.prisma.note.create({
            data: {
                ...dto
            }
        });

        return note;
    }

    findAll() {
        return this.prisma.note.findMany({});
    }

    findById(id: string) {
        return this.prisma.note.findUnique({ where: { id } });
    }

    update(id: string, dto: UpdateNoteDto) {
        return this.prisma.note.update({
            where: { id },
            data: dto
        });
    }

    removeById(id: string) {
        return this.prisma.note.delete({ where: { id } });
    }
}
