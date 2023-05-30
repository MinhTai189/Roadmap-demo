import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { CrudModule } from 'src/common/modules/crud.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
  imports: [CrudModule, PrismaModule],
})
export class TopicModule {}
