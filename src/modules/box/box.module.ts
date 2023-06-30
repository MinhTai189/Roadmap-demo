import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CrudModule } from 'src/common/modules/crud.module';
import { BoxService } from './box.service';
import { ConfigModule } from '@nestjs/config';
import { BoxController } from './box.controller';

@Module({
  imports: [PrismaModule, CrudModule, ConfigModule],
  controllers: [BoxController],
  providers: [BoxService],
  exports: [BoxService],
})
export class BoxModule {}
