import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isEmpty, isObject } from 'class-validator';
import { Request } from 'express';

const iterateObject = (object: Record<string, any>) => {
  for (const key in object) {
    const currentObj = object[key];

    if (isObject(currentObj)) {
      iterateObject(currentObj);
    } else if (currentObj === 'true') object[key] = true;
    else if (currentObj === 'false') object[key] = false;
  }
};

export const ConvertedQuery = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const { query }: Request = ctx.switchToHttp().getRequest();

    if (isEmpty(query)) return query;

    iterateObject(query);

    return data ? query[data] : query;
  },
);
