import { promises as fs } from 'fs';
import type { Context } from 'koa';
import { Joi } from 'koa-joi-router';
import path from 'path';

import { NotFoundError } from '../error/not-found-error';
import db from '../model';

export const controller = {
  read: async (ctx: Context) => {
    const photos = await db.Photo.findAll({
      include: [db.photoExif, db.photoThumbnails],
      order: [['shotTime', 'DESC']],
    });
    ctx.body = photos;
  },

  delete: async (ctx: Context) => {
    const { ids } = ctx.request.body as { ids: number[] };
    const photo = await db.Photo.destroy({ where: { id: ids } });
    ctx.body = photo;
  },

  readThumbnails: async (ctx: Context) => {
    const { id } = ctx.params;
    const { variant } = ctx.query;

    const thumbnail = await db.Thumbnail.findOne({
      where: { photoId: id, variant },
      attributes: ['filePath', 'format'],
      include: [db.Photo],
    });

    if (!thumbnail) throw new NotFoundError('Thumbnail not found.');

    const imagePath = path.join(
      '/Users/arthur/coding/moments-in-time/photos/thumbnails',
      thumbnail.filePath,
    );

    console.log('>>> read image');

    await fs.access(imagePath, fs.constants.F_OK);
    const data = await fs.readFile(imagePath);
    ctx.set('Cache-Control', 'public, max-age=86400');
    // @ts-ignore
    ctx.set('ETag', thumbnail.Photo.checkSum);
    ctx.type = `image/${thumbnail.format}`;
    ctx.body = data;
  },
};

export const validator = {
  read: {},
  delete: {
    type: 'json',
    body: {
      ids: Joi.array().items(Joi.number().integer().min(0)).min(1).required(),
    },
  },
  readThumbnails: {
    params: {
      id: Joi.number().integer().min(0).required(),
    },
    query: {
      // TODO(arthur): variant's value enum
      variant: Joi.required(),
    },
  },
};
