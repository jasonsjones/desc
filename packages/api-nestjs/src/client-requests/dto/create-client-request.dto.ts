import { ApiProperty } from '@nestjs/swagger';
import { CreateItemDto } from '../../items/dto/create-item.dto';

export class CreateClientRequestDto {
    @ApiProperty()
    clientId: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    items?: CreateItemDto[];
}
