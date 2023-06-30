import { CrudService } from 'src/common/modules/crud.service';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService extends CrudService {
  constructor(public prismaService: PrismaService) {
    super(prismaService, 'user');
  }

  async findUserWithEmail(email: string) {
    return await this.findOne({ email }, {});
  }
}
