import { promises as fs } from 'fs';
import { DEFAULT_MEDIA_DIR } from '../constants';
import path from 'path';

export async function copyToMediaFolder(file: File) {
  // @ts-ignore
  const targetPath = path.join(DEFAULT_MEDIA_DIR, file.newFilename);
  // @ts-ignore
  await fs.copyFile(file.filepath, targetPath, fs.constants.COPYFILE_EXCL);
  return targetPath;
}
