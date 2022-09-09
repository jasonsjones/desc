import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotesService } from '../notes.service';

describe('NotesService', () => {
    let service: NotesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [NotesService]
        }).compile();

        service = module.get<NotesService>(NotesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
