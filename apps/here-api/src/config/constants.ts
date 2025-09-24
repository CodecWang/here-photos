import os from 'os';
import path from 'path';

export const THUMBNAILS_DIR = path.join(
  os.homedir(),
  '.here-photos/thumbnails',
);

export const DEFAULT_MEDIA_DIR = path.join(os.homedir(), '.here-photos/photos');

export const UPLOADS_DIR = path.join(os.homedir(), '.here-photos/uploads');
