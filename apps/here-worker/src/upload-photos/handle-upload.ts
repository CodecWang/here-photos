import { promises as fs } from 'fs';

import { Exif, PhotoDAO, Thumbnail } from '@here-photos/db';
import { nanoid } from 'nanoid';
import sharp from 'sharp';

import { copyToMediaFolder } from '../utils/copy-to-media-folder';
import { generateThumbHash } from '../utils/generate-thumb-hash';
import { generateThumbnails } from '../utils/generate-thumbnails';
import { readExif } from '../utils/read-exif';

// TODO(arthur): handle file type(zod)
export async function handleUpload(file: {
  filepath: string;
  originalFilename: string;
  hash: string;
}) {
  const existingPhoto = await PhotoDAO.findByHash(file.hash);

  if (
    existingPhoto &&
    existingPhoto.Exif &&
    existingPhoto.Thumbnail.length > 0
  ) {
    return existingPhoto.photoId;
  }

  let thumbnails: Thumbnail[] | undefined;
  let exifData: Exif | undefined;

  const stat = await fs.stat(file.filepath);
  const fileBuffer = await fs.readFile(file.filepath);
  const fileSharp = sharp(fileBuffer);
  const { width, height, exif } = await fileSharp.metadata();
  const photoId = existingPhoto ? existingPhoto.photoId : nanoid(8);

  const needThumbnails = !existingPhoto || existingPhoto.Thumbnail.length === 0;
  const needExif = !existingPhoto || !existingPhoto.Exif;

  if (needThumbnails) {
    thumbnails = await generateThumbnails(photoId, width, height, fileSharp);
  }

  if (needExif) {
    exifData = await readExif(exif);
  }

  if (!existingPhoto) {
    if (!stat || !fileSharp) {
      throw new Error('File stat or sharp instance is missing');
    }

    // @ts-ignore
    await copyToMediaFolder(file);
    // const targetPath = await copyToMediaFolder(file);

    const blurHash = await generateThumbHash(fileSharp);
    const birthTime = exifData?.shotTime ?? stat.birthtime;

    const data = {
      photoId,
      hash: file.hash,
      blurHash,
      birthTime,
      modifiedTime: stat.mtime,
      PhotoFile: { createMany: { data: [{ filePath: file.filepath }] } },
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

  return photoId;
}
