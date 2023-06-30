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
import { User } from 'src/common/decorators/user.decorator';
import { OneResourceDto } from 'src/common/dtos/one-resource.dto';
import { TransformBodyPipe } from 'src/common/pipes/transform-body.pipe';
import { Models } from 'src/enums/models.enum';
import { VocabularyDto } from 'src/generated/dtos';
import { JWTGuard } from '../auth/strategies/jwt.strategy';
import {
  CreateVocabularyDto,
  UpdateVocabularyDto,
} from './dto/vocabulary-crud.dto';
import { VocabularyService } from './vocabulary.service';
import { ListVocabularyDto } from './dto/list-vocabulary.dto';
import { ListResourcePayloadDto } from 'src/common/dtos/list-resource.dto';
import { ConvertedQuery } from 'src/common/decorators/query.decorator';

@ApiTags('Vocabulary')
@Controller('vocabularies')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Post()
  @ApiOperation({ summary: 'Create New Vocabulary' })
  @ApiCreatedResponse({
    description: 'The vocabulary have been created successfully',
    type: VocabularyDto,
  })
  @ApiBody({
    type: CreateVocabularyDto,
    description: 'Create New Vocabulary Payload',
  })
  @UseGuards(JWTGuard)
  create(
    @Body(TransformBodyPipe(Models.Vocabulary))
    createVocabularyDto: CreateVocabularyDto,
    @User('id') userId: number,
  ) {
    return this.vocabularyService.createVocabulary(createVocabularyDto, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get A Vocabulary' })
  @ApiCreatedResponse({
    description: 'The vocabulary have been returned successfully',
    type: VocabularyDto,
  })
  @UseGuards(JWTGuard)
  getOne(@Query() query: OneResourceDto) {
    return this.vocabularyService.findOne(+query.id, {
      select: query.select,
      include: query.include,
      where: query.where,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Vocabulary' })
  @ApiCreatedResponse({
    description: 'The vocabulary have been updated successfully',
    type: VocabularyDto,
  })
  @ApiQuery({
    required: true,
    type: 'string',
    name: 'id',
  })
  @UseGuards(JWTGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVocabularyDto: UpdateVocabularyDto,
  ) {
    return this.vocabularyService.update(id, updateVocabularyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Vocabulary' })
  @ApiCreatedResponse({
    description: 'The vocabulary have been deleted successfully',
    type: VocabularyDto,
  })
  @ApiQuery({
    required: true,
    type: 'string',
    name: 'id',
  })
  @UseGuards(JWTGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.vocabularyService.delete(id);
  }

  @Get('belong-topic/:topicId')
  @ApiOperation({ summary: 'Get List of Vocabularies by a topic' })
  @ApiCreatedResponse({
    description: 'List of vocabularies have been returned successfully',
    type: ListVocabularyDto,
  })
  @UseGuards(JWTGuard)
  getByTopic(
    @Param('topicId', ParseIntPipe) topicId: number,
    @ConvertedQuery() listRequestDto: ListResourcePayloadDto,
  ) {
    return this.vocabularyService.getVocabulariesByTopic(
      listRequestDto,
      topicId,
    );
  }

  @Get('belong-box/:boxId')
  @ApiOperation({ summary: 'Get List of Vocabularies by a box' })
  @ApiCreatedResponse({
    description: 'List of vocabularies have been returned successfully',
    type: ListVocabularyDto,
  })
  @UseGuards(JWTGuard)
  getByBox(
    @Param('boxId', ParseIntPipe) boxId: number,
    @ConvertedQuery() listRequestDto: ListResourcePayloadDto,
  ) {
    return this.vocabularyService.getVocabulariesByBox(listRequestDto, boxId);
  }
}
