import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ListResourcePayloadDto } from 'src/common/dtos/list-resource.dto';
import { OneResourceDto } from 'src/common/dtos/one-resource.dto';
import { TransformBodyPipe } from 'src/common/pipes/transform-body.pipe';
import { Models } from 'src/enums/models.enum';
import { TopicDto } from 'src/generated/dtos';
import { JWTGuard } from '../auth/strategies/jwt.strategy';
import { ListTopicDto } from './dto/list-topic.dto';
import { CreateTopicDto, UpdateTopicDto } from './dto/topic-crud.dto';
import { TopicService } from './topic.service';
import { User } from 'src/common/decorators/user.decorator';
import { ConvertedQuery } from 'src/common/decorators/query.decorator';

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
  @UseGuards(JWTGuard)
  get(
    @ConvertedQuery() listRequestDto: ListResourcePayloadDto,
    @User('id') userId: number,
  ) {
    return this.topicService.getAll(listRequestDto, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create New Topic' })
  @ApiCreatedResponse({
    description: 'The topic have been created successfully',
    type: TopicDto,
  })
  @ApiBody({ type: CreateTopicDto, description: 'Create New Topic Payload' })
  @UseGuards(JWTGuard)
  create(@Body() createTopicDto: CreateTopicDto, @User('id') userId: number) {
    return this.topicService.create({ ...createTopicDto, userId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get A Topic' })
  @ApiCreatedResponse({
    description: 'The topic have been returned successfully',
    type: TopicDto,
  })
  @UseGuards(JWTGuard)
  getOne(@Query() query: OneResourceDto) {
    return this.topicService.findOne(+query.id, {
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
  @UseGuards(JWTGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
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
    type: 'number',
    name: 'id',
  })
  @UseGuards(JWTGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.topicService.delete(id);
  }
}
