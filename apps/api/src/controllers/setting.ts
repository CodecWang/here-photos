import type { Context } from 'koa';

import db from '../models';

export const controller = {
  read: async (ctx: Context) => {
    const settings = await db.Setting.findAll();
    const ret = settings.reduce((acc, setting) => {
      acc[setting.key] = JSON.parse(setting.value);
      return acc;
    }, {});
    ctx.body = ret;
  },
};

export const validator = {
  read: {},
};
