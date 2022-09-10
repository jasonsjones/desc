import { ApiProperty } from '@nestjs/swagger';
import { Item } from '../../items/entities/item.entity';

export class ClientRequest {
    @ApiProperty()
    id: string;

    @ApiProperty()
    clientId: string;

    @ApiProperty()
    userId: string;

    @ApiProperty({ type: [Item] })
    items: Item[];

    @ApiProperty({ type: Date })
    createdAt: Date;

    @ApiProperty({ type: Date })
    updatedAt: Date;
}
