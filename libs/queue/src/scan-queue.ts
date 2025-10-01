import { Job, Queue, QueueEvents, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({ maxRetriesPerRequest: null });
export const scanQueue = new Queue('scan', { connection });

export const scanQueueEvents = new QueueEvents('scan', { connection });

export async function addScanTask(payload: unknown) {
  return await scanQueue.add('scanDirs', payload, {
    removeOnComplete: true,
    removeOnFail: false,
  });
}

export function createScanWorker(processor: (job: Job) => Promise<void>) {
  return new Worker('scan', processor, { connection });
}
