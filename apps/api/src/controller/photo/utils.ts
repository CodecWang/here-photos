import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

export async function scanDirectories(
  directories: string[],
): Promise<string[]> {
  const imageExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
    '.tiff',
    '.svg',
  ];
  const results = [];

  const scan = async (dir: string) => {
    const files = await fs.readdir(dir);

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
          await scan(filePath);
        } else if (imageExtensions.includes(path.extname(file).toLowerCase())) {
          results.push(filePath);
        }
      }),
    );
  };

  await Promise.all(directories.map(scan));
  return results;
}

/**
 * Removes subdirectories from the list of directories and returns only the top-level directories
 * @param directories - List of directories
 * @returns List of top-level directories
 */
export function filterTopLevelDirectories(directories: string[]) {
  // Step 1: Remove duplicates
  const uniqueDirectories = Array.from(new Set(directories));

  // Step 2: Filter top-level directories
  return uniqueDirectories.filter((dir, _, arr) => {
    // Check if the current directory is not a subdirectory of any other directory
    return !arr.some(
      (otherDir) => dir !== otherDir && dir.startsWith(otherDir + path.sep),
    );
  });
}

export async function calCheckSum(data: Buffer, algorithm = 'md5') {
  try {
    const hash = crypto.createHash(algorithm);
    hash.update(data);
    return hash.digest('hex');
  } catch (err) {
    console.error('error:', err);
  }
}
