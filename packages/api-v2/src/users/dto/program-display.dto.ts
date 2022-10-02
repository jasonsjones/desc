import { ApiProperty } from '@nestjs/swagger';
import { Program } from '@prisma/client';

export class ProgramDisplayDto {
    @ApiProperty({ enum: Program })
    value: Program;

    @ApiProperty()
    displayValue: string;
}
