import { ApiProperty, OmitType } from '@nestjs/swagger';
import { TopicDto } from 'src/generated/dtos';
import { ListResourceResponseDto } from 'src/common/dtos/list-resource.dto';

export class ListTopicDto extends OmitType(ListResourceResponseDto, ['data']) {
  @ApiProperty({ required: true, isArray: true, type: TopicDto })
  data: Array<TopicDto>;
}
