import path from 'path';

import { Thumbnail } from '@here-photos/db';
import { Sharp } from 'sharp';

import { THUMBNAILS_DIR } from '../constants';

export async function generateThumbnails(
  photoId: string,
  width: number,
  height: number,
  photoSharp: Sharp
): Promise<Thumbnail[]> {
  // TODO(arthur): 1. also delete thumbnail files when delete db record
  //               2. check if local thumbnail file exists, if not, generate it again
  //               3. thumbnail not only for jpg, but also png, etc.
  //               4. generate multiple sizes of thumbnails
  const outputFileName = `th_m_${photoId}.jpg`;
  const smallerSize = Math.min(width < height ? width : height, 800);
  const output = path.join(THUMBNAILS_DIR, outputFileName);

  const outputImg = await photoSharp
    .resize(width < height ? { width: smallerSize } : { height: smallerSize })
    .jpeg({ mozjpeg: true })
    .toFile(output);

  return [
    {
      type: 'md',
      size: outputImg.size,
      filePath: outputFileName,
      width: outputImg.width,
      height: outputImg.height,
      format: outputImg.format,
    },
  ];
}
