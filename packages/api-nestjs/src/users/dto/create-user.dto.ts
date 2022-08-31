import { ApiProperty } from '@nestjs/swagger';
import { Program } from '@prisma/client';

export class CreateUserDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    program: Program;
}
