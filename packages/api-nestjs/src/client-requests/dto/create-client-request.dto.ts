import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateClientRequestDto implements Prisma.ClientRequestCreateWithoutSubmittedByInput {
    @ApiProperty()
    clientId: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    items?: Prisma.ItemCreateNestedManyWithoutRequestInput;
}
