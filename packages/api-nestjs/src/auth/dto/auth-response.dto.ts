import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class AuthUserResponse {
    @ApiProperty({ type: String, nullable: true })
    access_token: string | null;

    @ApiProperty({ required: false })
    user?: User;
}
