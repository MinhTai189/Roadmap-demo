import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ListResourceResponseDto } from 'src/common/dtos/list-resource.dto';
import { VocabularyDto } from 'src/generated/dtos';

export class ListExaminationDto extends OmitType(ListResourceResponseDto, [
  'data',
]) {
  @ApiProperty({ required: true, isArray: true, type: VocabularyDto })
  data: Array<VocabularyDto>;
}
