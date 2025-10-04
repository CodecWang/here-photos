import { promises as fs } from 'fs';

import { Exif, PhotoDAO, Thumbnail } from '@here-photos/db';
import { nanoid } from 'nanoid';
import sharp from 'sharp';

import { calculateHash } from '../utils/calculate-hash';
import { generateThumbHash } from '../utils/generate-thumb-hash';
import { generateThumbnails } from '../utils/generate-thumbnails';
import { readExif } from '../utils/read-exif';
import { syncFilePath } from '../utils/sync-file-path';

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

  let thumbnails: Thumbnail[] | undefined;
  let exifData: Exif | undefined;

  const fileSharp = sharp(fileBuffer);
  const { width, height, exif } = await fileSharp.metadata();
  const photoId = existingPhoto ? existingPhoto.photoId : nanoid(8);

  const needThumbnails = !existingPhoto || existingPhoto.Thumbnail.length === 0;
  const needExif = !existingPhoto || !existingPhoto.Exif;

  if (needThumbnails) {
    console.log('>>> cal thumbnails');
    thumbnails = await generateThumbnails(photoId, width, height, fileSharp);
  }

  if (needExif) {
    console.log('>>> cal exif');
    exifData = await readExif(exif);
  }

  if (!existingPhoto) {
    const blurHash = await generateThumbHash(fileSharp);
    const birthTime = exifData?.shotTime ?? stat.birthtime;

    const data = {
      hash,
      photoId,
      blurHash,
      birthTime,
      modifiedTime: stat.mtime,
      PhotoFile: { createMany: { data: [{ filePath }] } },
      Exif: exifData && { create: exifData },
      Thumbnail: thumbnails && { createMany: { data: thumbnails } },
    };
    await PhotoDAO.create(data);
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
