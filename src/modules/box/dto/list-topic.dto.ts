import { ApiProperty, OmitType } from '@nestjs/swagger';
import { BoxDto } from 'src/generated/dtos';
import { ListResourceResponseDto } from 'src/common/dtos/list-resource.dto';

export class ListBoxDto extends OmitType(ListResourceResponseDto, ['data']) {
  @ApiProperty({ required: true, isArray: true, type: BoxDto })
  data: Array<BoxDto>;
}
