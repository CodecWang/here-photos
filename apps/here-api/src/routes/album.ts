import { AlbumDAO, PhotoDAO } from '@here-photos/db';
import {
  AlbumDTO,
  albumDTOSchema,
  albumGroupDTOSchema,
  AlbumReadQueryDTOSchema,
  photoGroupDTOSchema,
  PhotoReadQueryDTO,
  photoReadQueryDTOSchema,
} from '@here-photos/dto';
import Router from '@koa/router';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import {
  albumsDeleteBodySchema,
  albumReadParamsSchema,
  albumCreateBodySchema,
  BatchPayloadSchema,
  albumUpdateParamsSchema,
  albumUpdateBodySchema,
  albumAddPhotosBodySchema,
} from '../schemas/album';
import { PhotoService } from '../services/photo';
import { utc2cst } from '../utils/utc-convert';
import { validateReq, validateRsp } from '../utils/validate';

const router = new Router({ prefix: '/api/v1/albums' });

router.get(
  '/',
  validateReq({ query: AlbumReadQueryDTOSchema }),
  validateRsp(z.array(albumGroupDTOSchema)),
  async (ctx) => {
    const { groupBy } = ctx.request.query;
    console.log('>>> get albums', groupBy);
    const albums = (
      await AlbumDAO.getAlbums({
        orderBy: { createdAt: 'desc' },
      })
    ).map(({ _count, ...album }) => ({
      ...album,
      createdAt: utc2cst(album.createdAt)?.toISO() ?? '',
      photosCount: _count.AlbumPhoto,
    }));

    console.log('>>> albums', albums.length);
    if (groupBy === 'none') {
      ctx.body = albums.length > 0 ? [{ title: '', albums }] : [];
      return;
    }

    if (groupBy === 'year') {
      const groupedAlbums = albums.reduce(
        (acc: { [key: string]: AlbumDTO[] }, album) => {
          const date = utc2cst(album.createdAt)?.toFormat('yyyy');
          if (!date) return acc;

          if (!acc[date]) acc[date] = [];
          acc[date].push(album);
          return acc;
        },
        {}
      );

      const ret = Object.entries(groupedAlbums)
        .map(([date, albums]) => ({
          albums,
          title: date,
          count: albums.length,
        }))
        .sort((a, b) => b.title.localeCompare(a.title));

      ctx.body = ret;
      return;
    }

    ctx.body = [];
  }
);

router.post(
  '/',
  validateReq({ body: albumCreateBodySchema }),
  validateRsp(albumDTOSchema),
  async (ctx) => {
    const { title } = ctx.request.body;
    ctx.body = await AlbumDAO.create({ title, albumId: nanoid(8) });
  }
);

router.delete(
  '/',
  validateReq({ body: albumsDeleteBodySchema }),
  validateRsp(BatchPayloadSchema),
  async (ctx) => {
    const { albumIds } = ctx.request.body;
    ctx.body = await AlbumDAO.deleteAlbums(albumIds);
  }
);

router.get(
  '/:albumId',
  validateReq({ params: albumReadParamsSchema }),
  validateRsp(albumDTOSchema),
  async (ctx) => {
    const { albumId } = ctx.params;
    const album = await AlbumDAO.read(albumId);
    if (!album) {
      // TODO(arthur): unify this kind of error handling
      throw new Error('Album not found');
    }
    ctx.body = album;
  }
);

router.put(
  '/:albumId',
  validateReq({ params: albumUpdateParamsSchema, body: albumUpdateBodySchema }),
  validateRsp(albumDTOSchema),
  async (ctx) => {
    const { albumId } = ctx.params;
    const { title, pinned } = ctx.request.body;
    ctx.body = await AlbumDAO.update(albumId, { title, pinned });
  }
);

router.get(
  '/:albumId/photos',
  validateReq({
    params: albumReadParamsSchema,
    query: photoReadQueryDTOSchema,
  }),
  validateRsp(z.array(photoGroupDTOSchema)),
  async (ctx) => {
    const { albumId } = ctx.params;
    const { timeline, orderBy, order } = ctx.request.query as PhotoReadQueryDTO;
    const photos = await PhotoDAO.getPhotosByAlbumId(albumId, {
      orderBy: { [orderBy]: order },
    });
    // @ts-ignore
    ctx.body = await PhotoService.sortAndGroupPhotos(photos, {
      timeline,
      order,
    });
  }
);

router.post(
  '/:albumId/photos',
  validateReq({
    params: albumReadParamsSchema,
    body: albumAddPhotosBodySchema,
  }),
  validateRsp(BatchPayloadSchema),
  async (ctx) => {
    const { albumId } = ctx.params;
    const { photoIds } = ctx.request.body;
    AlbumDAO.update(albumId, { coverId: photoIds[0] });
    ctx.body = await AlbumDAO.addPhotos(albumId, photoIds);
  }
);

export default router;
