import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { FieldSchemas } from './dtos/schema.interface';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    this.$use(async (params, next) => {
      return await next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private transformField(fieldSchema) {
    return {
      name: fieldSchema.name,
      kind: fieldSchema.kind,
      isRequired: fieldSchema.isRequired,
      isUnique: fieldSchema.isUnique,
      isId: fieldSchema.isId,
      isReadOnly: fieldSchema.isReadOnly,
      type: fieldSchema.type,
      isList: fieldSchema.isList,
      relationName: fieldSchema.relationName,
      isGenerated: fieldSchema.isGenerated,
    };
  }

  modelSchema(modelName: string): FieldSchemas {
    const fieldsSchema: any = Prisma.dmmf.datamodel.models.find(
      (item: any) => item.name.toLowerCase() === modelName.toLowerCase(),
    );

    if (!fieldsSchema) return {};

    return fieldsSchema.fields.reduce((schema, fieldSchema) => {
      schema[fieldSchema.name] = this.transformField(fieldSchema);

      return schema;
    }, {});
  }
}
