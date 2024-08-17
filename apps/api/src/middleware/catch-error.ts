import type { Context, Next } from 'koa';
import { UniqueConstraintError } from 'sequelize';

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
    let { message } = error;
    let status = error.status ?? 500;

    if (error instanceof UniqueConstraintError) {
      status = 400;
      message = error.errors.map((e) => e.message).join('\n');
    }

    ctx.status = status;
    ctx.body = {
      message,
      code: status, // TODO(arthur): use status for now, use define ctx.code later.
      data: null,
    };

    // ctx.app.emit('error', error, ctx); // 触发错误事件
  }
}
