import { Job, Queue, Worker } from 'bullmq';

import { connection } from './redis-connection';

const scanQueue = new Queue('scan', { connection });

export async function addScanTask(payload: unknown) {
  return await scanQueue.add('scanDirs', payload, {
    removeOnComplete: true,
    removeOnFail: false,
  });
}

export function createScanWorker(processor: (job: Job) => Promise<void>) {
  return new Worker('scan', processor, { connection });
}
