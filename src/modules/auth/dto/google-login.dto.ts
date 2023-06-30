import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GGLoginDto {
  @ApiProperty({ required: true, type: 'string' })
  @IsNotEmpty()
  @IsString()
  credential: string;
}
