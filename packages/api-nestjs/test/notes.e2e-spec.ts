import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Program } from '@prisma/client';
import { AppModule } from '../src/app.module';
import { ItemsService } from '../src/items/items.service';
import { NotesService } from '../src/notes/notes.service';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UsersService } from '../src/users/users.service';

describe('NotesController (e2e)', () => {
    let app: INestApplication;
    let itemsService: ItemsService;
    let notesService: NotesService;
    let usersService: UsersService;
    let userId: string;

    const userData: CreateUserDto = {
        firstName: 'James',
        lastName: 'Gordon',
        email: 'james@desc.org',
        password: '123456',
        program: Program.INTEGRATED_SERVICES
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        itemsService = moduleFixture.get<ItemsService>(ItemsService);
        notesService = moduleFixture.get<NotesService>(NotesService);
        usersService = moduleFixture.get<UsersService>(UsersService);
        app = moduleFixture.createNestApplication();
        await app.init();

        const user = await usersService.create(userData);
        userId = user.id;
    });

    afterEach(async () => {
        await usersService.removeById(userId);
    });

    it('does NOT blow up', () => {
        expect(notesService).toBeDefined();
        expect(userId).toBeTruthy();
    });
});
