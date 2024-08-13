import type { Context } from 'koa';
import { Joi } from 'koa-joi-router';

import db from '../models';

export const settingController = {
  read: async (ctx: Context) => {
    const settings = await db.Setting.findAll();
    const ret = settings.reduce((acc, setting) => {
      acc[setting.key] = JSON.parse(setting.value);
      return acc;
    }, {});
    ctx.body = ret;
  },
};

export const settingValidator = {
  read: {},
};
