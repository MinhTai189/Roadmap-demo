import { Injectable } from '@nestjs/common';
import { ListResourcePayloadDto } from 'src/common/dtos/list-resource.dto';
import { CrudService } from 'src/common/modules/crud.service';
import { BoxService } from '../box/box.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVocabularyDto } from './dto/vocabulary-crud.dto';

@Injectable()
export class VocabularyService extends CrudService {
  constructor(
    public readonly prismaService: PrismaService,
    public readonly boxService: BoxService,
  ) {
    super(prismaService, 'vocabulary');
  }

  async createVocabulary(
    createVocabularyDto: CreateVocabularyDto,
    userId: number,
  ) {
    const firstBox = await this.boxService.findOne(
      {
        level_userId: {
          userId,
          level: 1,
        },
      },
      {},
    );

    const createdVocabulary = await this.create({
      ...createVocabularyDto,
      box: {
        connect: { id: firstBox.id },
      },
    });

    return createdVocabulary;
  }

  async getVocabulariesByTopic(
    listRequestDto: ListResourcePayloadDto = {},
    topicId: number,
  ) {
    listRequestDto.where = {
      ...listRequestDto.where,
      topicId,
    };

    return this.getAll(listRequestDto);
  }

  async getVocabulariesByBox(
    listRequestDto: ListResourcePayloadDto = {},
    boxId: number,
  ) {
    listRequestDto.where = {
      ...listRequestDto.where,
      boxId,
    };

    return this.getAll(listRequestDto);
  }
}
