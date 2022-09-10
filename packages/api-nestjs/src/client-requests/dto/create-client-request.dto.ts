import { ApiProperty } from '@nestjs/swagger';
import { Item } from '@prisma/client';

export class CreateClientRequestDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    clientId: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    items?: Item[];
}
