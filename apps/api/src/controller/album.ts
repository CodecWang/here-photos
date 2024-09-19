import type { Context } from 'koa';
import { Joi } from 'koa-joi-router';

import { NotFoundError } from '../error/not-found-error';
import db from '../model';

export const controller = {
  read: async (ctx: Context) => {
    const albums = await db.Album.findAll({
      attributes: {
        include: [
          [
            db.sequelize.fn('COUNT', db.sequelize.col('photos.id')),
            'photoCount',
          ],
        ],
      },
      include: [
        db.albumCover,
        {
          association: db.albumPhotos,
          through: { attributes: [] },
          attributes: [],
        },
      ],
      group: ['Album.id'],
    });

    ctx.body = albums;
  },

  create: async (ctx: Context) => {
    const { title } = ctx.request.body as { title: string };
    ctx.body = await db.Album.create({ title });
  },

  delete: async (ctx: Context) => {
    const { ids } = ctx.request.body as { ids: number[] };
    const album = await db.Album.destroy({ where: { id: ids } });
    ctx.body = album;
  },

  addPhotos: async (ctx: Context) => {
    const id = ctx.params.id;

    const { photoIds } = ctx.request.body as { photoIds: number[] };
    const album = await db.Album.findByPk(id);

    if (!album) throw new NotFoundError('Album not found.');

    await album.addPhotos(photoIds);
    if (!album.coverId) album.setCover(photoIds[0]);
    ctx.body = album;
  },

  readPhotos: async (ctx: Context) => {
    const { id } = ctx.params;
    const album = await db.Album.findByPk(id, {
      include: [
        {
          association: db.albumPhotos,
          include: [db.photoThumbnails],
        },
      ],
    });

    if (!album) throw new NotFoundError('Album not found.');
    ctx.body = album;
  },
};

export const validator = {
  create: {
    type: 'json' as const,
    body: {
      title: Joi.string().max(64).required(),
    },
  },
  delete: {
    type: 'json' as const,
    body: {
      ids: Joi.array().items(Joi.number().integer().min(0)).min(1).required(),
    },
  },
  readPhotos: {
    params: {
      id: Joi.number().integer().min(0).required(),
    },
  },
};
