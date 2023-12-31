import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { CrudModule } from 'src/common/modules/crud.module';
import { BoxModule } from '../box/box.module';

@Module({
  controllers: [VocabularyController],
  providers: [VocabularyService],
  imports: [PrismaModule, CrudModule, BoxModule],
  exports: [VocabularyService],
})
export class VocabularyModule {}
