import { Job } from '@here-photos/queue';
import { QueueStatus, QueueTaskDAO } from '@here-photos/db';
import { filterTopDirs } from '../utils/filter-top-dirs';
import { readDirsFiles } from '../utils/read-dirs-files';
import { handleScan } from './handle-scan';
import { reconcilePhotoFiles } from '../utils/reconcilePhotoFiles';

export async function scanPhotoDirs(job: Job) {
  const { photoDirs, taskId } = job.data;

  await QueueTaskDAO.update(taskId, { status: QueueStatus.RUNNING });
  const dirs = filterTopDirs(photoDirs);
  const filePaths = await readDirsFiles(dirs);
  await QueueTaskDAO.update(taskId, { total: filePaths.length });

  // TODO(arthur): get scandirs from db
  const scanDirs = [
    '/Users/arthur/Pictures/sample-photos/test',
    '/Users/arthur/Pictures/sample-photos/test2',
  ];

  let processed = 0;
  let success = 0;
  let failed = 0;

  for (const filePath of filePaths) {
    try {
      await handleScan(filePath, scanDirs);
      success++;
    } catch (error) {
      // TODO(arthur): remove generated files like thumbnails if failed
      failed++;
      console.error(`>>> Error processing file ${filePath}:`, error);
    } finally {
      processed++;
      await QueueTaskDAO.update(taskId, { processed, success, failed });
    }
  }

  await reconcilePhotoFiles(scanDirs);
}
