import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { ExaminationController } from './examination.controller';
import { ExaminationService } from './examination.service';
import { BoxModule } from '../box/box.module';
import { VocabularyModule } from '../vocabulary/vocabulary.module';
import { AnswerService } from 'src/common/services/answer.service';

@Module({
  imports: [PrismaModule, ConfigModule, BoxModule, VocabularyModule],
  controllers: [ExaminationController],
  providers: [ExaminationService, AnswerService],
  exports: [ExaminationService],
})
export class ExaminationModule {}
