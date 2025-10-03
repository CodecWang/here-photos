import os from 'os';
import path from 'path';

export const SUPPORTED_PHOTO_FORMATS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.bmp',
  '.tiff',
  '.svg',
];

export const THUMBNAILS_DIR = path.join(
  os.homedir(),
  '.here-photos/thumbnails'
);

export const DEFAULT_MEDIA_DIR = path.join(os.homedir(), '.here-photos/photos');
