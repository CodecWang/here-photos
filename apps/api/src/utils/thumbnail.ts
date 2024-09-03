import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

export async function getThumbnailsDir() {
  const thumbnailsDir = path.join(os.homedir(), '.here-photos/thumbnails');
  try {
    await fs.access(thumbnailsDir);
  } catch (error) {
    await fs.mkdir(thumbnailsDir, { recursive: true });
  }
  return thumbnailsDir;
}
