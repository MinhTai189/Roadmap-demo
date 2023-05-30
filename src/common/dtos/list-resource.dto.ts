import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';
import { OneResourceDto } from './one-resource.dto';

export class ListResourcePayloadDto extends OmitType(OneResourceDto, ['id']) {
  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @IsPositive()
  page?: number;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @IsPositive()
  size?: number;
}

export class ListResourceResponseDto<T = Record<string, any>> {
  @ApiProperty({ required: true, type: 'number' })
  count: number;

  @ApiProperty({ required: true, type: 'number' })
  page: number;

  @ApiProperty({ required: true, type: 'number' })
  size: number;

  @ApiProperty({ required: true })
  data: Array<T>;
}
