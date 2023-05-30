import { TopicDto } from 'src/generated/dtos';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class CreateTopicDto extends OmitType(TopicDto, [
  'id',
  'userId',
  'user',
  'vocabularies',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty({ required: false, isArray: true, type: 'number' })
  @IsOptional()
  @IsArray({ each: true })
  vocabularies?: number[];
}

export class UpdateTopicDto extends PartialType(CreateTopicDto) {}
