import { Module } from '@nestjs/common';
import { ClientRequestService } from './client-requests.service';
import { ClientRequestController } from './client-requests.controller';

@Module({
    controllers: [ClientRequestController],
    providers: [ClientRequestService]
})
export class ClientRequestModule {}
