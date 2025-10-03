import Router from '@koa/router';
import { AlbumDAO } from '@here-photos/db';
import {
  addPhotosSchema,
  albumIdSchema,
  CreateAlbumInput,
  createAlbumSchema,
  DeleteAlbumsInput,
  deleteAlbumsSchema,
  UpdateAlbumInput,
  updateAlbumSchema,
} from '../schemas/album';
import { validate } from '../utils/validate';
import { nanoid } from 'nanoid';

const router = new Router({ prefix: '/api/v1/albums' });

router.get('/', async (ctx) => {
  ctx.body = await AlbumDAO.findMany();
});

router.post('/', validate({ body: createAlbumSchema }), async (ctx) => {
  const { title } = ctx.request.body as CreateAlbumInput;
  ctx.body = await AlbumDAO.create({ title, albumId: nanoid(8) });
});

router.delete('/', validate({ body: deleteAlbumsSchema }), async (ctx) => {
  const { albumIds } = ctx.request.body as DeleteAlbumsInput;
  ctx.body = await AlbumDAO.deleteManyByAlbumIds(albumIds);
});

router.put(
  '/:albumId',
  validate({ params: albumIdSchema, body: updateAlbumSchema }),
  async (ctx) => {
    const { albumId } = ctx.params;
    const { title } = ctx.request.body as UpdateAlbumInput;
    ctx.body = await AlbumDAO.update(albumId, { title });
  }
);

router.get('/:albumId', validate({ params: albumIdSchema }), async (ctx) => {
  const { albumId } = ctx.params;
  ctx.body = await AlbumDAO.findPhotosByAlbumId(albumId);
});

router.post(
  '/:albumId/photos',
  validate({
    params: albumIdSchema,
    body: addPhotosSchema,
  }),
  async (ctx) => {
    const { albumId } = ctx.params;
    const { photoIds } = ctx.request.body;
    ctx.body = await AlbumDAO.addPhotos(albumId, photoIds);
  }
);

export default router;
