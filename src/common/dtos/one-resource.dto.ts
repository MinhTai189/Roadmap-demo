import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsPositive } from 'class-validator';
import {
  IncludeQuery,
  OrderByQuery,
  SelectQuery,
  WhereQuery,
} from './query.dto';

export class OneResourceDto {
  @ApiProperty({ required: true, type: 'number' })
  @IsNotEmpty()
  @IsPositive()
  id: number;

  @ApiProperty({ required: false, type: 'object' })
  @IsOptional()
  @IsObject()
  orderBy?: OrderByQuery;

  @ApiProperty({ required: false, type: 'object' })
  @IsOptional()
  @IsObject()
  select?: SelectQuery;

  @ApiProperty({ required: false, type: 'object' })
  @IsOptional()
  @IsObject()
  include?: IncludeQuery;

  @ApiProperty({ required: false, type: 'object' })
  @IsOptional()
  @IsObject()
  where?: WhereQuery;
}
