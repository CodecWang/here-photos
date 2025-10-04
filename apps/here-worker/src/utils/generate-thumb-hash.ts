import { rgbaToThumbHash } from '@here-photos/thumb-hash';

import type { Sharp } from 'sharp';

export async function generateThumbHash(photoSharp: Sharp) {
  const thumbnail = photoSharp.resize(100, 100, { fit: 'inside' });
  const { data, info } = await thumbnail
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const binaryThumbHash = rgbaToThumbHash(info.width, info.height, data);
  return Buffer.from(binaryThumbHash).toString('base64');
}
