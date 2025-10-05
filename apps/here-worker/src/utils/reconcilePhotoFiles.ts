import { promises as fs } from 'fs';
import path from 'path';

import { PhotoDAO, PhotoFileDAO } from '@here-photos/db';

// Reconciliation and cleanup of photo files
export async function reconcilePhotoFiles(scanDirs: string[]) {
  const photoFiles = await PhotoFileDAO.findMany();

  const toBeDeletedPhotos: string[] = [];

  for (const pf of photoFiles) {
    try {
      await fs.access(pf.filePath);
    } catch (error) {
      toBeDeletedPhotos.push(pf.photoId);
      continue;
    }

    if (!scanDirs.some((dir) => isInDir(dir, pf.filePath))) {
      toBeDeletedPhotos.push(pf.photoId);
      continue;
    }
  }

  if (toBeDeletedPhotos.length > 0) {
    await PhotoDAO.deleteManyByPhotoIds(toBeDeletedPhotos);
  }
}

function isInDir(parent: string, maybeInside: string) {
  const rel = path.relative(parent, maybeInside);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}
