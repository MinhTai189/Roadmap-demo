import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TopicModule } from './modules/topic/topic.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { AuthModule } from './modules/auth/auth.module';

const modules = [TopicModule, VocabularyModule, AuthModule];

@Module({
  imports: modules,
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
