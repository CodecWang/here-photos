import { prisma } from '@here-photos/db';
import Router from '@koa/router';

const router = new Router({ prefix: '/api/v1/settings' });

router.get('/', async (ctx) => {
  ctx.body = await prisma.setting.findMany();
});

router.put('/', async (ctx) => {
  const settings = ctx.request.body;
  const keys = Object.keys(settings);
  await Promise.all(
    keys.map(async (key) => {
      const value = JSON.stringify(settings[key]);
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    })
  );
  ctx.body = ctx.request.body;
});

export default router;
