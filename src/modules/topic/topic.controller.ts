import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TopicDto } from 'src/generated/dtos';
import { ListTopicDto } from './dto/list-topic.dto';
import { CreateTopicDto, UpdateTopicDto } from './dto/topic-crud.dto';
import { TopicService } from './topic.service';
import { Models } from 'src/enums/models.enum';
import { ListResourcePayloadDto } from 'src/common/dtos/list-resource.dto';
import { TransformBodyPipe } from 'src/common/pipes/transform-body.pipe';
import { OneResourceDto } from 'src/common/dtos/one-resource.dto';

@ApiTags('Topic')
@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  @ApiOperation({ summary: 'Get List of Topic' })
  @ApiCreatedResponse({
    description: 'List of topic have been returned successfully',
    type: ListTopicDto,
  })
  get(@Query() listRequestDto: ListResourcePayloadDto) {
    return this.topicService.getAll(listRequestDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create New Topic' })
  @ApiCreatedResponse({
    description: 'The topic have been created successfully',
    type: TopicDto,
  })
  @ApiBody({ type: CreateTopicDto, description: 'Create New Topic Payload' })
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicService.create(createTopicDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get A Topic' })
  @ApiCreatedResponse({
    description: 'The topic have been returned successfully',
    type: TopicDto,
  })
  getOne(@Query() query: OneResourceDto) {
    return this.topicService.findOne(query.id, {
      select: query.select,
      include: query.include,
      where: query.where,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Topic' })
  @ApiCreatedResponse({
    description: 'The topic have been updated successfully',
    type: TopicDto,
  })
  @ApiQuery({
    required: true,
    type: 'string',
    name: 'id',
  })
  update(
    @Query('id', ParseIntPipe) id: number,
    @Body(TransformBodyPipe(Models.Topic)) updateTopicDto: UpdateTopicDto,
  ) {
    return this.topicService.update(id, updateTopicDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Topic' })
  @ApiCreatedResponse({
    description: 'The vocabulary have been deleted successfully',
    type: TopicDto,
  })
  @ApiQuery({
    required: true,
    type: 'string',
    name: 'id',
  })
  delete(@Query('id', ParseIntPipe) id: number) {
    return this.topicService.delete(id);
  }
}
