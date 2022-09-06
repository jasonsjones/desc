import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
    create(dto: CreateNoteDto) {
        return 'This action adds a new note';
    }

    findAll() {
        return `This action returns all notes`;
    }

    findOne(id: string) {
        return `This action returns a #${id} note`;
    }

    update(id: string, dto: UpdateNoteDto) {
        return `This action updates a #${id} note`;
    }

    remove(id: string) {
        return `This action removes a #${id} note`;
    }
}
