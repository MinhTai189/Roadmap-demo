import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';
import { VocabularyDto } from 'src/generated/dtos';

export class CreateVocabularyDto extends OmitType(VocabularyDto, [
  'id',
  'rememberCount',
  'topicId',
  'createdAt',
  'updatedAt',
  'topic',
  'boxId',
  'box',
]) {
  @ApiProperty({ required: true, type: 'number' })
  @IsNotEmpty()
  @IsPositive()
  topic: number;
}

export class UpdateVocabularyDto extends PartialType(CreateVocabularyDto) {}
