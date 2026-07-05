import { SettingDAO } from '@here-photos/db';
import { settingDTOSchema } from '@here-photos/dto';
import Router from '@koa/router';

import { validateRsp } from '../utils/validate';

const router = new Router({ prefix: '/api/v1/settings' });

router.get('/', validateRsp(settingDTOSchema), async (ctx) => {
  const settings = await SettingDAO.getSettings();
  const result: Record<string, unknown> = {};
  settings.forEach((setting) => {
    try {
      result[setting.key] = JSON.parse(setting.value ? setting.value : '');
    } catch {
      result[setting.key] = setting.value;
    }
  });

  ctx.body = result;
});

router.put('/', async (ctx) => {
  const settings = JSON.parse(ctx.request.body);
  const keys = Object.keys(settings);
  await Promise.all(
    keys.map(async (key) => {
      const value = JSON.stringify(settings[key]);
      await SettingDAO.updateSetting(key, value);
    })
  );
  ctx.body = ctx.request.body;
});

export default router;
