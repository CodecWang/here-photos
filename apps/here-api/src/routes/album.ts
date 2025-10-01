import Router from '@koa/router';
import { prisma } from '@here-photos/db';
import {
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
  ctx.body = await prisma.album.findMany({
    include: {
      _count: {
        // TODO(arthur): validate here
        select: { AlbumPhoto: true },
      },
    },
  });
});

router.post('/', validate({ body: createAlbumSchema }), async (ctx) => {
  const { title } = ctx.request.body as CreateAlbumInput;

  ctx.body = await prisma.album.create({
    data: {
      title,
      albumId: nanoid(8),
    },
  });
});

router.delete('/', validate({ body: deleteAlbumsSchema }), async (ctx) => {
  const { albumIds } = ctx.request.body as DeleteAlbumsInput;
  ctx.body = await prisma.album.deleteMany({
    where: { albumId: { in: albumIds } },
  });
});

router.put(
  '/:albumId',
  validate({ params: albumIdSchema, body: updateAlbumSchema }),
  async (ctx) => {
    const { albumId } = ctx.params;
    const { title } = ctx.request.body as UpdateAlbumInput;

    ctx.body = await prisma.album.update({
      where: { albumId },
      data: { title },
    });
  }
);

export default router;
