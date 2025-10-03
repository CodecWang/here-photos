import { createScanWorker, createUploadWorker } from '@here-photos/queue';
import { scanPhotoDirs } from './scan-photo-dirs';
import { QueueStatus, QueueTaskDAO } from '@here-photos/db';
import { uploadPhotos } from './upload-photos';

console.log('>>> Here Worker started...');

const workers = [
  {
    name: 'scanPhotoDirs',
    worker: createScanWorker(scanPhotoDirs),
  },
  {
    name: 'uploadPhotos',
    worker: createUploadWorker(uploadPhotos),
  },
];

workers.forEach(({ name, worker }) => {
  worker.on('completed', async (job) => {
    const { taskId } = job?.data || {};
    console.log(
      `>>> Job ${job?.id} in \`${name}\`(taskId: ${taskId}) has completed!`
    );

    if (taskId) {
      await QueueTaskDAO.update(taskId, { status: QueueStatus.COMPLETED });
    }
  });

  worker.on('failed', (job, err) => {
    const { taskId } = job?.data || {};

    console.error(
      `>>> Job ${job?.id} in \`${name}\`(taskId: ${taskId}) has failed with error: ${err.message}`
    );
    if (taskId) {
      QueueTaskDAO.update(taskId, { status: QueueStatus.FAILED });
    }
  });
});
