import { createScanWorker } from '@here-photos/queue';
import { scanPhotoDirs } from './scan-photo';

console.log('Hello World');

const worker = createScanWorker(scanPhotoDirs);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} has failed with error ${err.message}`);
});
