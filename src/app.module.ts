import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TopicModule } from './modules/topic/topic.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { AuthModule } from './modules/auth/auth.module';
import { BoxModule } from './modules/box/box.module';
import { CaslModule } from './modules/casl/casl.module';
import { ExaminationModule } from './modules/examination/examination.module';

const modules = [
  TopicModule,
  VocabularyModule,
  AuthModule,
  BoxModule,
  CaslModule,
  ExaminationModule,
];

@Module({
  imports: modules,
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
