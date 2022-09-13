import { ApiProperty } from '@nestjs/swagger';
import { HouseLocation, ItemCategory, ItemPriority, ItemStatus, Prisma } from '@prisma/client';
import { CreateNoteDto } from '../../notes/dto/create-note.dto';

export class CreateItemDto {
    @ApiProperty()
    clientId: string;

    @ApiProperty({ enum: ItemCategory })
    category: ItemCategory;

    @ApiProperty()
    name: string;

    @ApiProperty()
    userId: string;

    @ApiProperty({ enum: HouseLocation })
    location: HouseLocation;

    @ApiProperty()
    quantity: number;

    @ApiProperty({ required: false })
    size?: string;

    @ApiProperty({ required: false, enum: ItemPriority })
    priority?: ItemPriority;

    @ApiProperty({ required: false, enum: ItemStatus })
    status?: ItemStatus;

    @ApiProperty({ required: false })
    note?: Omit<CreateNoteDto, 'itemId'>;
}
