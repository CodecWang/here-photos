import { Context, Next } from 'koa';
import { ParsedUrlQuery } from 'querystring';
import { ZodType } from 'zod';

type SchemaMap = {
  body?: ZodType<unknown>;
  query?: ZodType<unknown>;
  params?: ZodType<unknown>;
};

export const validate = <T extends SchemaMap>({ body, query, params }: T) => {
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

    await next();
  };
};
