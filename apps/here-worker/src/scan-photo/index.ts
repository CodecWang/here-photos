import { Job } from '@here-photos/queue';

import { prisma } from '@here-photos/db';
import { filterTopDirs } from './filter-top-dirs';
import { readDirsFiles } from './read-dirs-fils';
import { processPhoto } from './process-photo';

enum ScanStatus {
  PENDING = 1,
  RUNNING = 2,
  COMPLETED = 3,
  FAILED = 4,
}

export async function scanPhotoDirs(job: Job) {
  const { photoDirs, taskId } = job.data;
  await prisma.scanTask.update({
    where: { taskId },
    data: { status: ScanStatus.RUNNING },
  });

  const dirs = filterTopDirs(photoDirs);
  const filePaths = await readDirsFiles(dirs);
  await prisma.scanTask.update({
    where: { taskId },
    data: { total: filePaths.length },
  });

  let processed = 0,
    success = 0,
    failed = 0;

  for (const filePath of filePaths) {
    try {
      await processPhoto(filePath);
      success++;
    } catch (error) {
      failed++;
      console.error(`Error processing file ${filePath}:`, error);
    } finally {
      processed++;
      await prisma.scanTask.update({
        where: { taskId },
        data: { processed, success, failed },
      });
    }
  }

  await prisma.scanTask.update({
    where: { taskId },
    data: { status: ScanStatus.COMPLETED },
  });
}
