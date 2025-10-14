import { promises as fs } from 'fs';
import path from 'path';

import { PhotoDAO, QueueTaskDAO, ThumbnailDAO } from '@here-photos/db';
import {
  PhotoGroupDTOSchema,
  PhotoDTO,
  PhotoReadQueryDTOSchema,
  PhotoReadQueryDTO,
} from '@here-photos/dto';
import { addScanTask, addUploadTask } from '@here-photos/queue';
import Router from '@koa/router';
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import z from 'zod';

import { THUMBNAILS_DIR } from '../config/constants';
import {
  deletePhotosSchema,
  photoIdSchema,
  nanoId8Schema,
  uploadPhotosSchema,
  UploadPhotosInput,
  thumbnailTypeSchema,
} from '../schemas/photo';
import { utc2cst } from '../utils/utc-convert';
import { validateReq, validateRsp } from '../utils/validate';

const router = new Router({ prefix: '/api/v1/photos' });

router.get(
  '/',
  validateReq({ query: PhotoReadQueryDTOSchema }),
  validateRsp(z.array(PhotoGroupDTOSchema)),
  async (ctx) => {
    const { timeline, orderBy, order } = ctx.request.query as PhotoReadQueryDTO;
    const photos = await PhotoDAO.getPhotos({ orderBy: { [orderBy]: order } });
    const formatMap = {
      none: '',
      year: 'yyyy',
      month: 'yyyy-MM',
      day: 'yyyy-MM-dd',
    } as const;
    const format = formatMap[timeline as keyof typeof formatMap] ?? 'yyyy-MM';
    const groupMap = new Map<string, PhotoDTO[]>();

    for (const photo of photos) {
      const localTime = utc2cst(photo.birthTime);
      if (!localTime) continue;

      const key = localTime.toFormat(format);
      const group = groupMap.get(key);
      const data = {
        ...photo,
        birthTime: localTime.toISO(),
      };

      if (group) group.push(data);
      else groupMap.set(key, [data]);
    }

    const groups = [...groupMap.entries()]
      .sort(([a], [b]) => {
        const dtA = DateTime.fromFormat(a, format);
        const dtB = DateTime.fromFormat(b, format);
        return order === 'desc'
          ? dtB.toMillis() - dtA.toMillis()
          : dtA.toMillis() - dtB.toMillis();
      })
      .map(([title, photos]) => ({ title, photos }));

    ctx.body = groups;
  }
);

router.delete('/', validateReq({ body: deletePhotosSchema }), async (ctx) => {
  ctx.body = await PhotoDAO.deleteManyByPhotoIds(ctx.request.body.photoIds);
});

router.get('/:photoId', validateReq({ params: photoIdSchema }), async (ctx) => {
  ctx.body = await PhotoDAO.findByPhotoId(ctx.params.photoId);
});

router.get(
  '/:photoId/thumbnails',
  validateReq({ params: photoIdSchema, query: thumbnailTypeSchema }),
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
  validateReq({ params: nanoId8Schema }),
  async (ctx) => {
    ctx.body = await QueueTaskDAO.findByTaskId(ctx.params.taskId);
  }
);

router.post(
  '/upload',
  validateReq({ files: uploadPhotosSchema }),
  async (ctx) => {
    const { files, albumIds } = ctx.request
      .files as unknown as UploadPhotosInput;
    const task = await QueueTaskDAO.create({
      taskId: nanoid(8),
      type: 'upload',
    });
    const job = await addUploadTask({ files, taskId: task.taskId, albumIds });
    ctx.body = { taskId: task.taskId, jobId: job.id, albumIds };
  }
);

router.get(
  '/upload/:taskId',
  validateReq({ params: nanoId8Schema }),
  async (ctx) => {
    ctx.body = await QueueTaskDAO.findByTaskId(ctx.params.taskId);
  }
);

export default router;
