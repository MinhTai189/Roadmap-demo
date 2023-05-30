import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Module({
  providers: [],
  imports: [PrismaModule],
})
export class CrudModule {}
