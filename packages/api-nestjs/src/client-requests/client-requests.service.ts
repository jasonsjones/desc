import { Injectable } from '@nestjs/common';
import { CreateClientRequestDto } from './dto/create-client-request.dto';
import { UpdateClientRequestDto } from './dto/update-client-request.dto';

@Injectable()
export class ClientRequestService {
    create(dto: CreateClientRequestDto) {
        return 'This action adds a new clientRequest';
    }

    findAll() {
        return `This action returns all clientRequest`;
    }

    findOne(id: string) {
        return `This action returns a #${id} clientRequest`;
    }

    update(id: string, dto: UpdateClientRequestDto) {
        return `This action updates a #${id} clientRequest`;
    }

    remove(id: string) {
        return `This action removes a #${id} clientRequest`;
    }
}
