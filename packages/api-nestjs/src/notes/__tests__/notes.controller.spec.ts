import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotesController } from '../notes.controller';
import { NotesService } from '../notes.service';

describe('NotesController', () => {
    let controller: NotesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            controllers: [NotesController],
            providers: [NotesService]
        }).compile();

        controller = module.get<NotesController>(NotesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
