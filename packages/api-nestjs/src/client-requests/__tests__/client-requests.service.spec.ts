import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/prisma.service';
import { ClientRequestService } from '../client-requests.service';
import { CreateClientRequestDto } from '../dto/create-client-request.dto';
import {
    payloadWithItemsAndNotes,
    payloadWithItemsWithoutNotes,
    payloadWithSingleItem
} from './mockData';

describe('ClientRequestService', () => {
    let service: ClientRequestService;
    let prisma: PrismaService;

    const mockPrismaService = {
        clientRequest: {
            create: jest.fn().mockResolvedValue({})
        }
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [ClientRequestService]
        })
            .overrideProvider(PrismaService)
            .useValue(mockPrismaService)
            .compile();

        service = module.get<ClientRequestService>(ClientRequestService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create() provides the correct payload to prisma to create a new request', () => {
        it('with a single item (without a note)', async () => {
            const dto: CreateClientRequestDto = payloadWithSingleItem;
            await service.create(dto);
            const createPayload = mockPrismaService.clientRequest.create.mock.calls[0][0];

            expect(createPayload.data).toBeTruthy();
            expect(createPayload.include).toBeTruthy();
            expect(createPayload.data.items.create).toHaveLength(1);
            expect(createPayload.data.items.create[0].notes).toBeUndefined();
        });

        it('with several items (without notes)', async () => {
            const dto: CreateClientRequestDto = payloadWithItemsWithoutNotes;
            await service.create(dto);
            const createPayload = mockPrismaService.clientRequest.create.mock.calls[0][0];

            expect(createPayload.data).toBeTruthy();
            expect(createPayload.include).toBeTruthy();
            expect(createPayload.data.items.create).toHaveLength(2);
            expect(createPayload.data.items.create[0].notes).toBeUndefined();
            expect(createPayload.data.items.create[1].notes).toBeUndefined();
        });

        it('with several items, each including a note', async () => {
            const dto: CreateClientRequestDto = payloadWithItemsAndNotes;
            await service.create(dto);
            const createPayload = mockPrismaService.clientRequest.create.mock.calls[0][0];

            expect(createPayload.data).toBeTruthy();
            expect(createPayload.include).toBeTruthy();
            expect(createPayload.data.items.create).toHaveLength(2);
            expect(createPayload.data.items.create[0].notes.create).toBeTruthy();
            expect(createPayload.data.items.create[1].notes.create).toBeTruthy();
        });
    });
});
