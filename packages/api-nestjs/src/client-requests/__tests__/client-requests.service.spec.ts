import { Test, TestingModule } from '@nestjs/testing';
import { ClientRequestService } from '../client-requests.service';

describe('ClientRequestService', () => {
    let service: ClientRequestService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ClientRequestService]
        }).compile();

        service = module.get<ClientRequestService>(ClientRequestService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
