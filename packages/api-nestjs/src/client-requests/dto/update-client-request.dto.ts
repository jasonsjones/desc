import { PartialType } from '@nestjs/swagger';
import { CreateClientRequestDto } from './create-client-request.dto';

export class UpdateClientRequestDto extends PartialType(CreateClientRequestDto) {}
