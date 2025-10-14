import { ParsedUrlQuery } from 'querystring';

import { Context, Next } from 'koa';
import { ZodType } from 'zod';

type SchemaMap = {
  body?: ZodType<unknown>;
  query?: ZodType<unknown>;
  params?: ZodType<unknown>;
  files?: ZodType<unknown>;
};

export const validateReq = <T extends SchemaMap>({
  body,
  query,
  params,
  files,
}: T): ((ctx: Context, next: Next) => Promise<void>) => {
  return async (ctx: Context, next: Next) => {
    if (body) {
      ctx.request.body = await body.parse(ctx.request.body);
    }

    if (query) {
      ctx.request.query = (await query.parseAsync(
        ctx.request.query
      )) as ParsedUrlQuery;
    }

    if (params) {
      ctx.params = (await params.parseAsync(ctx.params)) as {
        [key: string]: string;
      };
    }

    if (files) {
      ctx.request.files = (await files.parse(ctx.request.files)) as any;
    }

    await next();
  };
};

export const validateRsp = <T>(
  schema: ZodType<T>
): ((ctx: Context, next: Next) => Promise<void>) => {
  return async (ctx: Context, next: Next) => {
    await next();

    if (ctx.body === undefined) {
      return;
    }

    // TODO(arthur): whether still send ctx.body data back if validation fails? (to help debugging?)
    try {
      ctx.body = schema.parse(ctx.body);
    } catch (error) {
      console.error(ctx.body);
      throw new Error(`Response validation failed: ${error}`);
    }
  };
};
