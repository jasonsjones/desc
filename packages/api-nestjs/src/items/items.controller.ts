import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
    constructor(private itemsService: ItemsService) {}

    @Post()
    create(@Body() dto: CreateItemDto) {
        return this.itemsService.create(dto);
    }

    @Get()
    findAll() {
        return this.itemsService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.itemsService.findById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
        return this.itemsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.itemsService.removeById(id);
    }
}
