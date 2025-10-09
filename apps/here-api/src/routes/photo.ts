import { promises as fs } from 'fs';
import path from 'path';

import { PhotoDAO, QueueTaskDAO, ThumbnailDAO } from '@here-photos/db';
import { addScanTask, addUploadTask } from '@here-photos/queue';
import Router from '@koa/router';
import { nanoid } from 'nanoid';

import { THUMBNAILS_DIR } from '../config/constants';
import {
  deletePhotosSchema,
  photoIdSchema,
  nanoId8Schema,
  uploadPhotosSchema,
  UploadPhotosInput,
  thumbnailTypeSchema,
} from '../schemas/photo';
import { validate } from '../utils/validate';

const router = new Router({ prefix: '/api/v1/photos' });

router.get('/', async (ctx) => {
  ctx.body = await PhotoDAO.findMany();
});

router.delete('/', validate({ body: deletePhotosSchema }), async (ctx) => {
  ctx.body = await PhotoDAO.deleteManyByPhotoIds(ctx.request.body.photoIds);
});

router.get('/:photoId', validate({ params: photoIdSchema }), async (ctx) => {
  ctx.body = await PhotoDAO.findByPhotoId(ctx.params.photoId);
});

router.get(
  '/:photoId/thumbnails',
  validate({ params: photoIdSchema, query: thumbnailTypeSchema }),
  async (ctx) => {
    const thumbnail = await ThumbnailDAO.findByPhotoIdAndType({
      photoId: ctx.params.photoId,
      type: ctx.request.query.type as string,
    });

    const imagePath = path.join(THUMBNAILS_DIR, thumbnail.filePath);
    await fs.access(imagePath, fs.constants.F_OK);
    const data = await fs.readFile(imagePath);
    ctx.set('Cache-Control', 'public, max-age=86400');
    // TODO(arthur): enable ETAG -> enable caching
    // ctx.set('ETag', thumbnail.Photo.checkSum);
    ctx.type = `image/${thumbnail.format}`;
    ctx.body = data;
  }
);

router.post('/scan', async (ctx) => {
  // const photoDirs = ['/Users/arthur/Pictures/sample-photos'];
  const photoDirs = [
    '/Users/arthur/Pictures/sample-photos/test',
    // '/Users/arthur/Pictures/sample-photos/test2',
  ];

  const task = await QueueTaskDAO.create({ taskId: nanoid(8), type: 'scan' });
  const job = await addScanTask({ photoDirs, taskId: task.taskId });
  ctx.body = { taskId: task.taskId, jobId: job.id };
});

router.get(
  '/scan/:taskId',
  validate({ params: nanoId8Schema }),
  async (ctx) => {
    ctx.body = await QueueTaskDAO.findByTaskId(ctx.params.taskId);
  }
);

router.post('/upload', validate({ files: uploadPhotosSchema }), async (ctx) => {
  const { files, albumIds } = ctx.request.files as unknown as UploadPhotosInput;
  const task = await QueueTaskDAO.create({
    taskId: nanoid(8),
    type: 'upload',
  });
  const job = await addUploadTask({ files, taskId: task.taskId, albumIds });
  ctx.body = { taskId: task.taskId, jobId: job.id, albumIds };
});

router.get(
  '/upload/:taskId',
  validate({ params: nanoId8Schema }),
  async (ctx) => {
    ctx.body = await QueueTaskDAO.findByTaskId(ctx.params.taskId);
  }
);

export default router;
