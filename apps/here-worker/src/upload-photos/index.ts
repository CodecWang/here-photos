import { promises as fs } from 'fs';

import { AlbumDAO, QueueStatus, QueueTaskDAO } from '@here-photos/db';

import { handleUpload } from './handle-upload';

import type { Job } from '@here-photos/queue';

export async function uploadPhotos(job: Job) {
  const { files, taskId, albumIds } = job.data;
  await QueueTaskDAO.update(taskId, {
    status: QueueStatus.RUNNING,
    total: files.length,
  });

  let processed = 0;
  let success = 0;
  let failed = 0;

  const photoIds: string[] = [];

  for (const file of files) {
    try {
      const photoId = await handleUpload(file);
      success++;
      photoIds.push(photoId);
    } catch (error) {
      // TODO(arthur): remove generated files like thumbnails if failed
      failed++;
      console.error('Error processing file', file.originalFilename, error);
    } finally {
      processed++;
      // remove temp upload file
      await fs.rm(file.filepath);
      await QueueTaskDAO.update(taskId, { processed, success, failed });
    }
  }

  if (albumIds && albumIds.length > 0) {
    for (const albumId of albumIds) {
      await AlbumDAO.addPhotos(albumId, photoIds);
    }
  }
}
