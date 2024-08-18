import exifReader from 'exif-reader';
import { promises as fs } from 'fs';
import type { Context } from 'koa';
import path from 'path';
import sharp, { type Sharp } from 'sharp';

import db from '../../model';
import { rgbaToThumbHash } from './thumb-hash';
import {
  calCheckSum,
  filterTopLevelDirectories,
  scanDirectories,
} from './utils';

export const controller = {
  scan: async (ctx: Context) => {
    const photoCreateOps = [];
    const photoUpdateOps = [];

    const setting = await db.Setting.findOne({ where: { key: 'photoDirs' } });
    console.log(JSON.parse(setting.value));

    const dirs = filterTopLevelDirectories(JSON.parse(setting.value));

    const localFiles = await scanDirectories(dirs);

    const photos = await db.Photo.findAll({
      attributes: ['filePath', 'checkSum'],
    });
    const photosMap = new Map<string, { id: number; photoSum: string }>(
      photos.map((p) => [p.filePath, { id: p.id, photoSum: p.checkSum }]),
    );

    for (const [filePath, localFile] of localFiles) {
      const buffer = await fs.readFile(filePath);
      const checkSum = await calCheckSum(buffer);

      if (!checkSum) {
        // TODO(arthur): Handle error
        continue;
      }

      const photo = photosMap.get(filePath);
      // File hasn't changed
      if (photo?.photoSum && photo.photoSum === checkSum) {
        continue;
      }

      const img = sharp(buffer);
      const { width, height, exif } = await img.metadata();
      const exifInfo = await readExif(exif);
      const thumbnails = await generateThumbnails(img, width, height, filePath);
      const thumbHash = await generateThumbHash(img);

      const fileInfo = {
        checkSum,
        blurHash: thumbHash,
        filePath,
        shotTime: exifInfo?.Photo?.DateTimeOriginal ?? localFile.createdTime,
        modifiedTime: localFile.modifiedTime,
      };

      // A new photo
      if (!photo) {
        photoCreateOps.push({ ...fileInfo, exif: exifInfo, thumbnails });
        continue;
      }

      // A photo has been updated
      if (photo.photoSum !== checkSum) {
        photoUpdateOps.push({
          ...fileInfo,
          exif: exifInfo,
          thumbnails,
          id: photo.id,
        });
      }
    }

    await db.Photo.bulkCreate(photoCreateOps, {
      include: [db.photoExif, db.photoThumbnails],
    });

    await Promise.all(
      photoUpdateOps.map((op) => db.Photo.update(op, { where: { id: op.id } })),
    );

    const deleteOps = photos
      .filter((p) => !localFiles.has(p.filePath))
      .map((p) => p.filePath);
    if (deleteOps.length > 0)
      await db.Photo.destroy({ where: { filePath: deleteOps } });

    ctx.body = true;
  },
};

async function readExif(exif: Buffer) {
  return exif ? exifReader(exif) : null;
}

async function generateThumbHash(img: Sharp) {
  const thumbnail = img.resize(100, 100, { fit: 'inside' });
  const { data, info } = await thumbnail
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const binaryThumbHash = rgbaToThumbHash(info.width, info.height, data);
  return Buffer.from(binaryThumbHash).toString('base64');
}

async function generateThumbnails(
  img: Sharp,
  width: number,
  height: number,
  filePath: string,
) {
  const filename = path.basename(filePath, path.extname(filePath));
  const smallerSize = Math.min(width < height ? width : height, 800);
  const outputFilename = `th_m_${filename}.jpg`;
  const output = path.join(
    '/Users/arthur/coding/moments-in-time/photos/thumbnails',
    outputFilename,
  );
  // medium/highres/small/blur/large
  const outputImg = await img
    .resize(width < height ? { width: smallerSize } : { height: smallerSize })
    .jpeg({ mozjpeg: true })
    .toFile(output);

  // @ts-ignore
  const d = outputImg;

  return [
    {
      variant: 2,
      size: d.size,
      filePath: outputFilename,
      width: d.width,
      height: d.height,
      format: d.format,
    },
  ];
}
