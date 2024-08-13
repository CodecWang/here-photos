import { Context, Next } from 'koa';
import { UniqueConstraintError } from 'sequelize';

export async function catchError(ctx: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      ctx.status = 400;
      return (ctx.body = error.errors.map((e) => e.message).join('\n'));
    }

    ctx.status = error.status || 500;
    ctx.body = error.message;

    // ctx.app.emit('error', error, ctx); // 触发错误事件
  }
}
