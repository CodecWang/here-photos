import { Job, Queue, Worker } from 'bullmq';

import { connection } from './redis-connection';

const uploadQueue = new Queue('upload', { connection });

export async function addUploadTask(payload: unknown) {
  return await uploadQueue.add('uploadFile', payload, {
    removeOnComplete: true,
    removeOnFail: false,
  });
}

export function createUploadWorker(processor: (job: Job) => Promise<void>) {
  return new Worker('upload', processor, { connection });
}
