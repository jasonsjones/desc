import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
    constructor(private itemsService: ItemsService) {}

    @Post()
    @ApiOperation({ summary: 'Creates a new item' })
    @ApiCreatedResponse({
        description: 'Item successfully created',
        type: Item
    })
    create(@Body() dto: CreateItemDto) {
        return this.itemsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieves all items' })
    @ApiOkResponse({ description: 'All items fetched', type: Item })
    findAll() {
        return this.itemsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieves a single item with the given id' })
    @ApiOkResponse({ description: 'Item with given id retrieved', type: Item })
    findById(@Param('id') id: string) {
        return this.itemsService.findById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Updates a single item with the given id' })
    @ApiOkResponse({ description: 'Item with given id updated', type: Item })
    update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
        return this.itemsService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletes a single item with the given id' })
    @ApiOkResponse({ description: 'Item with given id deleted', type: Item })
    remove(@Param('id') id: string) {
        return this.itemsService.removeById(id);
    }
}
