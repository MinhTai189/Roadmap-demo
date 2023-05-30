import { Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/modules/crud.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TopicService extends CrudService {
  constructor(public readonly prismaService: PrismaService) {
    super(prismaService, 'topic');
  }
}
