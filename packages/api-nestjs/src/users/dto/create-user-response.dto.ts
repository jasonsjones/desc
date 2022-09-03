import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class CreateUserResponse {
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    user: User;
}
