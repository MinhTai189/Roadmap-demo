import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { VocabularyDto } from 'src/generated/dtos';
import { ListVocabularyDto } from './dto/list-vocabulary.dto';
import {
  CreateVocabularyDto,
  UpdateVocabularyDto,
} from './dto/vocabulary-crud.dto';
import { VocabularyService } from './vocabulary.service';
import { ListResourcePayloadDto } from 'src/common/dtos/list-resource.dto';
import { TransformBodyPipe } from 'src/common/pipes/transform-body.pipe';
import { Models } from 'src/enums/models.enum';
import { OneResourceDto } from 'src/common/dtos/one-resource.dto';

@ApiTags('Vocabulary')
@Controller('vocabularies')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get()
  @ApiOperation({ summary: 'Get List of Vocabulary' })
  @ApiCreatedResponse({
    description: 'List of vocabulary have been returned successfully',
    type: ListVocabularyDto,
  })
  get(@Query() listRequestDto: ListResourcePayloadDto) {
    return this.vocabularyService.getAll(listRequestDto);
  }

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
  create(
    @Body(TransformBodyPipe(Models.Vocabulary))
    createVocabularyDto: CreateVocabularyDto,
  ) {
    return this.vocabularyService.create(createVocabularyDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get A Vocabulary' })
  @ApiCreatedResponse({
    description: 'The vocabulary have been returned successfully',
    type: VocabularyDto,
  })
  getOne(@Query() query: OneResourceDto) {
    return this.vocabularyService.findOne(query.id, {
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
  update(
    @Query('id', ParseIntPipe) id: number,
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
  delete(@Query('id', ParseIntPipe) id: number) {
    return this.vocabularyService.delete(id);
  }
}
