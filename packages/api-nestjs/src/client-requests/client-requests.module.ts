import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientRequestController } from './client-requests.controller';
import { ClientRequestService } from './client-requests.service';

@Module({
    imports: [PrismaModule],
    controllers: [ClientRequestController],
    providers: [ClientRequestService]
})
export class ClientRequestModule {}
