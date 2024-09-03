import type { Context } from 'koa';
import { Joi } from 'koa-joi-router';

import db from '../model';

export const controller = {
  read: async (ctx: Context) => {
    const settings = await db.Setting.findAll();
    const ret = settings.reduce((acc, setting) => {
      acc[setting.key] = JSON.parse(setting.value);
      return acc;
    }, {});
    ctx.body = ret;
  },

  update: async (ctx: Context) => {
    const settings = ctx.request.body;
    const keys = Object.keys(settings);
    await Promise.all(
      keys.map(async (key) => {
        const value = JSON.stringify(settings[key]);
        await db.Setting.upsert({ key, value });
      }),
    );
    ctx.body = ctx.request.body;
  },
};

export const validator = {
  read: {},
  update: {
    type: 'json' as const,
    body: {
      photoDirs: Joi.array().items(
        Joi.string().pattern(
          /^([a-zA-Z]:\\|\/)?([\w-]+(\\|\/)?)+$/,
          'directory path',
        ),
      ),
    },
  },
};
