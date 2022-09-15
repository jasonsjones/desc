import { ApiProperty } from '@nestjs/swagger';
import { HouseLocation, ItemCategory, ItemPriority, ItemStatus } from '@prisma/client';
import { User } from '../../users/entities/user.entity';

export class Item {
    @ApiProperty()
    id: string;

    @ApiProperty()
    clientId: string;

    // clientRequest: ClientRequest | undefined;

    @ApiProperty({ enum: ItemCategory })
    category: ItemCategory;

    @ApiProperty()
    name: string;

    @ApiProperty()
    userId: string;

    @ApiProperty({ enum: HouseLocation })
    location: HouseLocation;

    @ApiProperty({ type: User })
    submittedBy: User;

    @ApiProperty()
    quantity: number;

    @ApiProperty({ required: false })
    size?: string;

    @ApiProperty({ required: false, enum: ItemPriority })
    priority?: ItemPriority;

    @ApiProperty({ required: false, enum: ItemStatus })
    status?: ItemStatus;

    // notes: Note[];

    @ApiProperty({ type: Date })
    createdAt: Date;

    @ApiProperty({ type: Date })
    updatedAt: Date;
}
