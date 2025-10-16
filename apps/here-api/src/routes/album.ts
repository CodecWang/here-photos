import { AlbumDAO, PhotoDAO } from '@here-photos/db';
import {
  AlbumDTOSchema,
  AlbumWithPhotosCountDTOSchema,
  PhotoGroupDTOSchema,
  PhotoReadQueryDTO,
  PhotoReadQueryDTOSchema,
} from '@here-photos/dto';
import Router from '@koa/router';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import {
  AlbumsDeleteBodySchema,
  AlbumReadParamsSchema,
  AlbumCreateBodySchema,
  BatchPayloadSchema,
  AlbumUpdateParamsSchema,
  AlbumUpdateBodySchema,
  AlbumAddPhotosBodySchema,
} from '../schemas/album';
import { PhotoService } from '../services/photo';
import { validateReq, validateRsp } from '../utils/validate';

const router = new Router({ prefix: '/api/v1/albums' });

router.get(
  '/',
  validateRsp(z.array(AlbumWithPhotosCountDTOSchema)),
  async (ctx) => {
    const albums = await AlbumDAO.getAlbums({
      orderBy: { createdAt: 'desc' },
    });
    ctx.body = albums.map(({ _count, ...album }) => ({
      ...album,
      photosCount: _count.AlbumPhoto,
    }));
  }
);

router.post(
  '/',
  validateReq({ body: AlbumCreateBodySchema }),
  validateRsp(AlbumDTOSchema),
  async (ctx) => {
    const { title } = ctx.request.body;
    ctx.body = await AlbumDAO.create({ title, albumId: nanoid(8) });
  }
);

router.delete(
  '/',
  validateReq({ body: AlbumsDeleteBodySchema }),
  validateRsp(BatchPayloadSchema),
  async (ctx) => {
    const { albumIds } = ctx.request.body;
    ctx.body = await AlbumDAO.deleteAlbums(albumIds);
  }
);

router.get(
  '/:albumId',
  validateReq({ params: AlbumReadParamsSchema }),
  validateRsp(AlbumDTOSchema),
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
  validateReq({ params: AlbumUpdateParamsSchema, body: AlbumUpdateBodySchema }),
  validateRsp(AlbumDTOSchema),
  async (ctx) => {
    const { albumId } = ctx.params;
    const { title } = ctx.request.body;
    ctx.body = await AlbumDAO.update(albumId, { title });
  }
);

router.get(
  '/:albumId/photos',
  validateReq({
    params: AlbumReadParamsSchema,
    query: PhotoReadQueryDTOSchema,
  }),
  validateRsp(z.array(PhotoGroupDTOSchema)),
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
    params: AlbumReadParamsSchema,
    body: AlbumAddPhotosBodySchema,
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
