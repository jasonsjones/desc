import { ApiProperty } from '@nestjs/swagger';
import { Program, UserRole } from '@prisma/client';

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

    @ApiProperty({ enum: Program })
    program: Program;

    @ApiProperty({ enum: UserRole })
    roles: UserRole;

    @ApiProperty({ type: Date })
    createdAt: Date;

    @ApiProperty({ type: Date })
    updatedAt: Date;
}
