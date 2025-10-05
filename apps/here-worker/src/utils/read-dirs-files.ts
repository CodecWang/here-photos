import { promises as fs } from 'fs';
import path from 'path';

import { SUPPORTED_PHOTO_FORMATS } from '../constants';

export async function readDirsFiles(dirs: string[]): Promise<string[]> {
  const files: string[] = [];

  const walk = async (dir: string) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (
          SUPPORTED_PHOTO_FORMATS.includes(
            path.extname(entry.name).toLowerCase()
          )
        ) {
          files.push(fullPath);
        }
      })
    );
  };

  await Promise.all(dirs.map(walk));
  return files;

  // const files: string[] = [];

  // const walk = async (dir: string) => {
  //   const entries = await fs.readdir(dir, { withFileTypes: true });

  //   for (const entry of entries) {
  //     const fullPath = path.join(dir, entry.name);
  //     if (entry.isDirectory()) {
  //       await walk(fullPath);
  //     } else if (
  //       SUPPORTED_PHOTO_FORMATS.includes(path.extname(entry.name).toLowerCase())
  //     ) {
  //       files.push(fullPath);
  //     }
  //   }
  // };

  // for (const dir of dirs) {
  //   try {
  //     await fs.access(dir);
  //     await walk(dir);
  //   } catch (error) {
  //     // do nothing
  //   }
  // }

  // return files;
}
