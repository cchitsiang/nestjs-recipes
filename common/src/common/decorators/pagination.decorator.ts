import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PAGE_QUERY_METADATA = {
  name: 'page',
  required: false,
  description: 'Page portion of resources',
  type: Number,
};

export const LIMIT_QUERY_METADATA = {
  name: 'limit',
  required: false,
  description: 'Limit amount of resources. Default to 25',
  type: Number,
};

export interface IPagination {
  page: number;
  limit: number;
  offset: number;
}

export const toSafeInteger = (value: string | number, defaultValue: number) => {
  const num = Number(value);
  if (!isNaN(num)) {
    return Math.round(
      Math.max(Math.min(num, Number.MAX_SAFE_INTEGER), Number.MIN_SAFE_INTEGER),
    );
  } else {
    return defaultValue ? defaultValue : 0;
  }
};

export const Pagination = createParamDecorator(
  (
    data: { pageProperty?: string; limitProperty?: string },
    ctx: ExecutionContext,
  ) => {
    const req = ctx.switchToHttp().getRequest();
    const { pageProperty = 'page', limitProperty = 'limit' } = data || {};
    const page = toSafeInteger(req.query[pageProperty], 1);
    const limit = toSafeInteger(req.query[limitProperty], 25);
    return {
      page,
      limit,
      offset: (page - 1) * limit,
    } as IPagination;
  },
);
