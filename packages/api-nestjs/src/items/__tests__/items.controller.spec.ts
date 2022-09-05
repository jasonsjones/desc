import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../prisma/prisma.module';
import { ItemsController } from '../items.controller';
import { ItemsService } from '../items.service';

describe('ItemsController', () => {
    let controller: ItemsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            controllers: [ItemsController],
            providers: [ItemsService]
        }).compile();

        controller = module.get<ItemsController>(ItemsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
