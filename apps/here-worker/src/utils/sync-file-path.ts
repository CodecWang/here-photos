import { PhotoDAO } from '@here-photos/db';
import { promises as fs } from 'fs';
import { calculateHash } from './calculate-hash';

export async function syncFilePath(
  filePath: string,
  photoId: number,
  hash: string,
  currentFilePaths: string[],
  scanDirs: string[]
) {
  if (currentFilePaths.length === 1 && currentFilePaths[0] === filePath) return;

  const isAddPath = !currentFilePaths.includes(filePath);

  const toBeDeletedPaths: string[] = [];
  const candidates = currentFilePaths.filter((p) => p !== filePath);
  for (const candidate of candidates) {
    if (candidate !== filePath) {
      try {
        await fs.access(candidate);
      } catch (error) {
        toBeDeletedPaths.push(candidate);
        continue;
      }

      if (!scanDirs.some((dir) => candidate.startsWith(dir))) {
        toBeDeletedPaths.push(candidate);
        continue;
      }

      const buffer = await fs.readFile(candidate);
      const candidateHash = await calculateHash(buffer);
      if (candidateHash !== hash) {
        toBeDeletedPaths.push(candidate);
        continue;
      }
    }
  }

  if (toBeDeletedPaths.length > 0) {
    await PhotoDAO.update(photoId, {
      PhotoFile: {
        create: isAddPath ? { filePath } : undefined,
        deleteMany: { filePath: { in: toBeDeletedPaths } },
      },
    });
  }

  return;
}
