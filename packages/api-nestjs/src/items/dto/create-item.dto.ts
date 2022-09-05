import { ApiProperty } from '@nestjs/swagger';
import { HouseLocation, ItemCategory, ItemPriority, ItemStatus } from '@prisma/client';

export class CreateItemDto {
    @ApiProperty()
    clientId: string;
    category: ItemCategory;
    name: string;
    userId: string;
    location: HouseLocation;
    quantity: number;

    size?: string;
    priority?: ItemPriority;
    status?: ItemStatus;
    note?: string;
}
