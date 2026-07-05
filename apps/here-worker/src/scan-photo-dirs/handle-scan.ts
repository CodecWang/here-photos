import { promises as fs } from 'fs';

import { PhotoDAO } from '@here-photos/db';
import { nanoid } from 'nanoid';
import sharp from 'sharp';

import { calculateHash } from '../utils/calculate-hash';
import { generateThumbHash } from '../utils/generate-thumb-hash';
import { generateThumbnails } from '../utils/generate-thumbnails';
import { readExif } from '../utils/read-exif';
import { syncFilePath } from '../utils/sync-file-path';

import type { Prisma } from '@here-photos/db';

export async function handleScan(filePath: string, scanDirs: string[]) {
  const stat = await fs.stat(filePath);
  const fileBuffer = await fs.readFile(filePath);
  const hash = await calculateHash(fileBuffer);

  const existingPhoto = await PhotoDAO.findByHash(hash);
  if (
    existingPhoto &&
    existingPhoto.Exif &&
    existingPhoto.Thumbnail.length > 0
  ) {
    await syncFilePath(
      filePath,
      existingPhoto.id,
      hash,
      existingPhoto.PhotoFile.map((pf) => pf.filePath),
      scanDirs
    );

    return;
  }

  let thumbnails: Prisma.ThumbnailCreateManyPhotoInput[] | undefined;
  let exifData: Prisma.ExifCreateWithoutPhotoInput | undefined;

  const fileSharp = sharp(fileBuffer).rotate();
  const meta = await fileSharp.metadata();
  let { width, height } = meta;
  // swap width and height if rotated
  if ([5, 6, 7, 8].includes(meta.orientation ?? 1)) {
    [width, height] = [height, width];
  }
  const photoId = existingPhoto ? existingPhoto.photoId : nanoid(8);
  const needThumbnails = !existingPhoto || existingPhoto.Thumbnail.length === 0;
  const needExif = !existingPhoto || !existingPhoto.Exif;

  if (needThumbnails) {
    console.log('>>> cal thumbnails');
    thumbnails = await generateThumbnails(photoId, width, height, fileSharp);
  }

  if (needExif) {
    console.log('>>> cal exif');
    exifData = await readExif(meta.exif);
  }

  if (!existingPhoto) {
    const blurHash = await generateThumbHash(fileSharp);
    const birthTime = exifData?.shotTime ?? stat.birthtime;

    await PhotoDAO.create({
      hash,
      ratio: width / height,
      photoId,
      blurHash,
      birthTime,
      modifiedTime: stat.mtime,
      PhotoFile: { createMany: { data: [{ filePath }] } },
      Exif: { create: exifData },
      Thumbnail: { createMany: thumbnails && { data: thumbnails } },
    });
  } else {
    const data = {
      Exif: exifData && {
        upsert: { create: exifData, update: exifData },
      },
      Thumbnail: thumbnails && {
        deleteMany: {},
        createMany: { data: thumbnails },
      },
    };
    PhotoDAO.update(existingPhoto.id, data);
  }
}
