import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrudService } from 'src/common/modules/crud.service';

@Injectable()
export class VocabularyService extends CrudService {
  constructor(public readonly prismaService: PrismaService) {
    super(prismaService, 'vocabulary');
  }
}
