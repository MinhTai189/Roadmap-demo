import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  ListResourcePayloadDto,
  ListResourceResponseDto,
} from '../dtos/list-resource.dto';

export class CrudService {
  modelName = '';

  constructor(public readonly prismaService: PrismaService, modelName: string) {
    this.modelName = modelName;
  }

  async getAll(
    listPayload: ListResourcePayloadDto,
  ): Promise<ListResourceResponseDto> {
    let pagination = {
      page: listPayload.page,
      size: listPayload.size,
    };
    const count = await this.prismaService[this.modelName].count();

    if (!pagination.page || pagination.size) {
      pagination = { page: 1, size: count };
    }

    const query = {
      skip: (pagination.page - 1) * pagination.size,
      take: +pagination.size,
      where: listPayload.where,
      select: listPayload.select,
      include: listPayload.include,
    };

    const foundRecords = await this.prismaService[this.modelName].findMany(
      query,
    );

    return {
      count,
      data: foundRecords,
      page: +pagination.page,
      size: +pagination.size,
    };
  }

  async create(dto: Record<string, any>) {
    const createdRecord = await this.prismaService[this.modelName].create({
      data: dto,
    });

    return createdRecord;
  }

  async findOne(id: number | string, options, uniqueKey = 'id') {
    const foundRecord = await this.prismaService[this.modelName].findUnique({
      where: {
        [uniqueKey]: +id,
      },
      ...options,
    });

    return foundRecord;
  }

  async update(id: number, data: Record<string, any>) {
    const updatedRecord = await this.prismaService[this.modelName].update({
      where: {
        id,
      },
      data,
    });

    return updatedRecord;
  }

  async delete(id: number) {
    const deletedRecord = await this.prismaService[this.modelName].delete({
      where: {
        id,
      },
    });

    return deletedRecord;
  }
}
