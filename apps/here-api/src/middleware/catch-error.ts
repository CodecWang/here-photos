// import { Prisma } from '@prisma/client';
import z, { ZodError } from 'zod';

import type { Context, Next } from 'koa';

export async function catchError(ctx: Context, next: Next) {
  try {
    await next();

    if (ctx.type === 'application/json') {
      ctx.body = {
        code: 0,
        data: ctx.body,
        message: ctx.message,
      };
    }
  } catch (error) {
    if (error instanceof ZodError) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        data: null,
        message: z.treeifyError(error),
      };
      return;
    }

    // if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //   // https://www.prisma.io/docs/reference/api-reference/error-reference
    //   if (error.code === 'P2002') {
    //     ctx.status = 400;
    //     ctx.body = {
    //       code: 409,
    //       data: null,
    //       message: 'Unique constraint failed',
    //     };
    //     return;
    //   }
    // }

    ctx.status = 500;
    ctx.body = {
      code: 500,
      data: null,
      message: error instanceof Error ? error.message : 'Unknown error',
    };

    // ctx.app.emit('error', error, ctx); // 触发错误事件
  }
}
