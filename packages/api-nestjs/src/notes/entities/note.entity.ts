import { ApiProperty } from '@nestjs/swagger';

export class Note {
    @ApiProperty()
    id: string;

    @ApiProperty()
    body: string;

    @ApiProperty()
    itemId: string;

    @ApiProperty()
    userId: string;

    @ApiProperty({ type: Date })
    createdAt: Date;

    @ApiProperty({ type: Date })
    updatedAt: Date;
}
