import Router from '@koa/router';
import { addScanTask, addUploadTask } from '@here-photos/queue';
import { PhotoDAO, QueueTaskDAO } from '@here-photos/db';
import { nanoid } from 'nanoid';
import { validate } from '../utils/validate';
import {
  deletePhotosSchema,
  photoIdSchema,
  nanoId8Schema,
  uploadPhotosSchema,
  UploadPhotosInput,
} from '../schemas/photo';

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

router.post('/scan', async (ctx) => {
  // const photoDirs = ['/Users/arthur/Pictures/sample-photos'];
  const photoDirs = [
    '/Users/arthur/Pictures/sample-photos/test',
    '/Users/arthur/Pictures/sample-photos/test2',
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
