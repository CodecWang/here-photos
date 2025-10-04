import { promises as fs } from 'fs';
import path from 'path';

import { DEFAULT_MEDIA_DIR } from '../constants';

export async function copyToMediaFolder(file: File) {
  // @ts-ignore
  const targetPath = path.join(DEFAULT_MEDIA_DIR, file.newFilename);
  // @ts-ignore
  await fs.copyFile(file.filepath, targetPath, fs.constants.COPYFILE_EXCL);
  return targetPath;
}
