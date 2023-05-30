import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CrudModule } from 'src/common/modules/crud.module';

@Module({
  imports: [PrismaModule, CrudModule],
  exports: [],
})
export class UserModule {}
