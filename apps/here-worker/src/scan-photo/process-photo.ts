import { promises as fs } from 'fs';

import { prisma } from '@here-photos/db';
import sharp from 'sharp';
import { nanoid } from 'nanoid';
import { calculateHex } from './calculate-hex';
import { generateThumbHash } from './generate-thumb-hash';
import { generateThumbnails } from './generate-thumbnails';
import { readExif } from './read-exif';

export async function processPhoto(filePath: string) {
  const stat = await fs.stat(filePath);
  const fileBuffer = await fs.readFile(filePath);
  const checkSum = await calculateHex(fileBuffer);

  const existingPhoto = await prisma.photo.findUnique({
    where: { filePath },
    include: {
      Exif: true,
      Thumbnail: true,
    },
  });
  // console.log('>>> photo from db:', existingPhoto);

  if (
    existingPhoto &&
    existingPhoto.checkSum === checkSum &&
    // In case that exif and thumbnail info is missing, reprocess the photo
    existingPhoto.Exif &&
    existingPhoto.Thumbnail.length > 0
  ) {
    return;
  }

  const photoSharp = sharp(fileBuffer);
  const { width, height, exif } = await photoSharp.metadata();
  const photoId = existingPhoto ? existingPhoto.photoId : nanoid(8);

  const thumbnails = await generateThumbnails(
    photoId,
    width,
    height,
    photoSharp
  );
  const blurHash = await generateThumbHash(photoSharp);
  const exifInfo = await readExif(exif);

  if (!existingPhoto) {
    await prisma.photo.create({
      data: {
        photoId,
        filePath,
        checkSum,
        blurHash,
        shotTime: exifInfo.shotTime ?? stat.birthtime,
        modifiedTime: stat.mtime,
        Exif: { create: exifInfo },
        Thumbnail: { createMany: { data: thumbnails } },
      },
    });
  } else {
    await prisma.photo.update({
      where: { id: existingPhoto.id },
      data: {
        checkSum,
        blurHash,
        modifiedTime: stat.mtime,
        Exif: {
          upsert: {
            create: exifInfo,
            update: exifInfo,
          },
        },
        Thumbnail: {
          deleteMany: {},
          createMany: { data: thumbnails },
        },
      },
    });
  }
}
