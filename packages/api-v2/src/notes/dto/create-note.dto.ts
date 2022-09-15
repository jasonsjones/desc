import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
    @ApiProperty()
    body: string;

    @ApiProperty()
    itemId: string;

    @ApiProperty()
    userId: string;
}
