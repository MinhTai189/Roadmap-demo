import {
  ArgumentMetadata,
  Injectable,
  mixin,
  PipeTransform,
} from '@nestjs/common';
import { isObject } from 'class-validator';
import { Models } from 'src/enums/models.enum';
import { FieldSchemas } from 'src/modules/prisma/dtos/schema.interface';
import { PrismaService } from 'src/modules/prisma/prisma.service';

export function TransformBodyPipe(modelName: Models) {
  @Injectable()
  class Pipe implements PipeTransform {
    modelSchema: FieldSchemas = {};

    constructor(prismaService: PrismaService) {
      this.modelSchema = prismaService.modelSchema(modelName);
    }

    transform(value: any, metadata: ArgumentMetadata) {
      if (metadata.type !== 'body' || !isObject(value)) return value;

      const transformedValue = {};

      Object.entries(value).forEach(([key, value]) => {
        if (this.getFieldType(key) === 'Int') transformedValue[key] = +value;
        else if (this.isRelationField(key)) {
          transformedValue[key] = this.getNestedValue(value);
        } else transformedValue[key] = value;
      });

      return transformedValue;
    }

    getFieldType(fieldName: string) {
      return this.modelSchema[fieldName].type;
    }

    isRelationField(fieldName: string) {
      return this.modelSchema[fieldName].relationName;
    }

    isListField(fieldName: string) {
      return this.modelSchema[fieldName].isList;
    }

    getNestedValue(value: number | number[]) {
      if (Array.isArray(value)) {
        return {
          set: value.map((v) => ({
            id: v,
          })),
        };
      }

      return { connect: { id: value } };
    }
  }

  return mixin(Pipe);
}
