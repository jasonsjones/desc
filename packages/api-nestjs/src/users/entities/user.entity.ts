import { ApiProperty } from '@nestjs/swagger';
import { Program } from '@prisma/client';

// This class is defined to serve as openapi documentation
export class User {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty({ enum: Object.values(Program) })
    program: Program;
}
