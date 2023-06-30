import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ExaminationResult {
  @ApiProperty({ name: 'id', required: true, type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ name: 'answer', required: true, type: 'string' })
  @IsNotEmpty()
  @IsString()
  answer: string;
}
