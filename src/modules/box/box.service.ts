import { CrudService } from 'src/common/modules/crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BoxService extends CrudService {
  boxTimelines = [];

  constructor(
    public prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super(prismaService, 'box');

    this.boxTimelines = configService.get('BOX_TIMELINES').split(',');
  }

  createBoxes(userId: number) {
    for (let i = 1; i <= this.boxTimelines.length; i++) {
      this.create({
        name: `Box ${i}`,
        description: 'test',
        level: i,
        user: {
          connect: { id: userId },
        },
        timeline: +this.boxTimelines[i - 1],
        vocabularies: {},
      });
    }
  }
}
