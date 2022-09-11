import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientRequestService } from './client-requests.service';
import { CreateClientRequestDto } from './dto/create-client-request.dto';
import { UpdateClientRequestDto } from './dto/update-client-request.dto';

@Controller('client-requests')
export class ClientRequestController {
    constructor(private readonly clientRequestService: ClientRequestService) {}

    @Post()
    create(@Body() dto: CreateClientRequestDto) {
        return this.clientRequestService.create(dto);
    }

    @Get()
    findAll() {
        return this.clientRequestService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.clientRequestService.findOneById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateClientRequestDto) {
        return this.clientRequestService.updateById(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.clientRequestService.removeById(id);
    }
}
