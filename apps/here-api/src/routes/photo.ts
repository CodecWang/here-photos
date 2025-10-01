import Router from '@koa/router';
import { addScanTask } from '@here-photos/queue';
import { prisma } from '@here-photos/db';
import { nanoid } from 'nanoid';
import { validate } from '../utils/validate';
import {
  DeletePhotosInput,
  deletePhotosSchema,
  photoIdSchema,
  scanTaskIdSchema,
} from '../schemas/photo';

const router = new Router({ prefix: '/api/v1/photos' });

router.get('/', async (ctx) => {
  const photos = await prisma.photo.findMany({
    include: {
      Exif: true,
      Thumbnail: true,
    },
    orderBy: { shotTime: 'desc' },
  });
  ctx.body = photos;
});

router.get('/:photoId', validate({ params: photoIdSchema }), async (ctx) => {
  ctx.body = await prisma.photo.findFirstOrThrow({
    where: { photoId: ctx.params.photoId },
    include: {
      Exif: true,
      Thumbnail: true,
    },
  });
});

router.delete('/', validate({ body: deletePhotosSchema }), async (ctx) => {
  const { photoIds } = ctx.request.body as DeletePhotosInput;
  ctx.body = await prisma.photo.deleteMany({
    where: { photoId: { in: photoIds } },
  });
});

router.post('/scan', async (ctx) => {
  // const photoDirs = ['/Users/arthur/Pictures/sample-photos'];
  const photoDirs = [
    '/Users/arthur/Pictures/sample-photos/test',
    '/Users/arthur/Pictures/sample-photos/test2',
  ];

  const task = await prisma.scanTask.create({
    data: { taskId: nanoid(8) },
  });
  const job = await addScanTask({ photoDirs, taskId: task.taskId });
  ctx.body = { taskId: task.taskId, jobId: job.id };
});

router.get(
  '/scan/:taskId',
  validate({ params: scanTaskIdSchema }),
  async (ctx) => {
    ctx.body = await prisma.scanTask.findFirstOrThrow({
      where: { taskId: ctx.params.taskId },
    });
  }
);

export default router;
