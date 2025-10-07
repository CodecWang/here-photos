import exifReader from 'exif-reader';

import type { Prisma } from '@here-photos/db';

export async function readExif(
  exif?: Buffer
): Promise<Prisma.ExifCreateWithoutPhotoInput> {
  const exifData = exif ? exifReader(exif) : null;

  // TODO(arthur): add most used exif fields and handle gps info
  return {
    shotTime: exifData?.Photo?.DateTimeOriginal,
    cameraMake: exifData?.Image?.Make,
    cameraModel: exifData?.Image?.Model,
    iso: exifData?.Photo?.ISOSpeedRatings,
    gpsLatitude: undefined,
    gpsLongitude: undefined,
  };
}
