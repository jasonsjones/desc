import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../prisma/prisma.module';
import { ClientRequestService } from '../client-requests.service';

describe('ClientRequestService', () => {
    let service: ClientRequestService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [ClientRequestService]
        }).compile();

        service = module.get<ClientRequestService>(ClientRequestService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
