import { ApiProperty, OmitType } from '@nestjs/swagger';
import { VocabularyDto } from 'src/generated/dtos';
import { ListResourceResponseDto } from 'src/common/dtos/list-resource.dto';

export class ListVocabularyDto extends OmitType(ListResourceResponseDto, [
  'data',
]) {
  @ApiProperty({ required: true, isArray: true, type: VocabularyDto })
  data: Array<VocabularyDto>;
}
