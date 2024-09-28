import { rgbaToThumbHash } from '@here-photos/thumb-hash';
import exifReader from 'exif-reader';
import { promises as fs } from 'fs';
import type { Context } from 'koa';
import { Joi } from 'koa-joi-router';
import path from 'path';
import { Op } from 'sequelize';
import sharp, { type Sharp } from 'sharp';

import { DEFAULT_MEDIA_DIR, THUMBNAILS_DIR } from '../../config/constants';
import { NotFoundError } from '../../error/not-found-error';
import db from '../../model';
import { search } from '../../service/search';
import {
  calCheckSum,
  filterTopLevelDirectories,
  scanDirectories,
} from './utils';

export const controller = {
  read: async (ctx: Context) => {
    const photos = await db.Photo.findAll({
      include: [db.photoExif, db.photoThumbnails],
      order: [['shotTime', 'DESC']],
    });
    ctx.body = photos;
  },

  delete: async (ctx: Context) => {
    const { ids } = ctx.request.body as { ids: number[] };
    const photo = await db.Photo.destroy({ where: { id: ids } });
    ctx.body = photo;
  },

  upload: async (ctx: Context) => {
    const { files } = ctx.request.files;

    const uploadedFiles = Array.isArray(files) ? files : [files];
    uploadedFiles.forEach(async (file) => {
      const targetPath = path.join(DEFAULT_MEDIA_DIR, file.newFilename);
      try {
        await fs.copyFile(
          file.filepath,
          targetPath,
          fs.constants.COPYFILE_EXCL,
        );
        createOrUpdate(targetPath);
        await fs.rm(file.filepath);
      } catch (error) {
        // Do nothing
      }
    });

    ctx.body = true;
  },

  scan: async (ctx: Context) => {
    const setting = await db.Setting.findOne({ where: { key: 'photoDirs' } });

    const scanDirs = setting?.value
      ? [...JSON.parse(setting.value), DEFAULT_MEDIA_DIR]
      : [DEFAULT_MEDIA_DIR];
    const photoDirs = filterTopLevelDirectories(scanDirs);
    const filepaths = await scanDirectories(photoDirs);

    for (const filepath of filepaths) {
      createOrUpdate(filepath);
    }

    await db.Photo.destroy({
      where: {
        filePath: {
          [Op.notIn]: filepaths,
        },
      },
    });

    ctx.body = true;
  },

  search: async (ctx: Context) => {
    const { q } = ctx.query;
    if (!q || typeof q !== 'string') {
      ctx.body = [];
      return;
    }

    const ids = await search(q);
    if (!ids.length) {
      ctx.body = [];
      return;
    }

    const photos = await db.Photo.findAll({
      where: {
        id: ids,
      },
      include: [db.photoExif, db.photoThumbnails],
    });
    ctx.body = photos;
  },

  readThumbnails: async (ctx: Context) => {
    const { id } = ctx.params;
    const { variant } = ctx.query;

    const thumbnail = await db.Thumbnail.findOne({
      where: { photoId: id, variant },
      attributes: ['filePath', 'format'],
      include: [db.Photo],
    });

    if (!thumbnail) throw new NotFoundError('Thumbnail not found.');

    const imagePath = path.join(THUMBNAILS_DIR, thumbnail.filePath);

    await fs.access(imagePath, fs.constants.F_OK);
    const data = await fs.readFile(imagePath);
    ctx.set('Cache-Control', 'public, max-age=86400');
    // @ts-ignore
    ctx.set('ETag', thumbnail.Photo.checkSum);
    ctx.type = `image/${thumbnail.format}`;
    ctx.body = data;
  },
};

export const validator = {
  read: {},
  delete: {
    type: 'json' as const,
    body: {
      ids: Joi.array().items(Joi.number().integer().min(0)).min(1).required(),
    },
  },
  readThumbnails: {
    params: {
      id: Joi.number().integer().min(0).required(),
    },
    query: {
      // TODO(arthur): variant's value enum
      variant: Joi.required(),
    },
  },
};

async function createOrUpdate(filepath: string) {
  const stat = await fs.stat(filepath);

  const buffer = await fs.readFile(filepath);
  const checkSum = await calCheckSum(buffer);
  if (!checkSum) return;

  const photo = await db.Photo.findOne({
    where: { filePath: filepath },
    include: [db.photoExif, db.photoThumbnails],
  });

  if (
    photo &&
    photo.checkSum === checkSum &&
    // @ts-ignore
    photo.exif &&
    // @ts-ignore
    photo.thumbnails?.length >= 1
  )
    return;

  const img = sharp(buffer);
  const { width, height, exif } = await img.metadata();
  const exifInfo = await readExif(exif);
  const thumbnails = await generateThumbnails(img, width, height, filepath);
  const thumbHash = await generateThumbHash(img);

  const fileInfo = {
    checkSum,
    blurHash: thumbHash,
    filePath: filepath,
    shotTime: exifInfo?.Photo?.DateTimeOriginal ?? stat.birthtime,
    modifiedTime: stat.mtime,
  };

  if (!photo) {
    db.Photo.create(
      {
        ...fileInfo,
        // @ts-ignore
        exif: exifInfo,
        thumbnails,
      },
      {
        include: [db.photoExif, db.photoThumbnails],
      },
    );
  } else {
    db.Photo.update(
      {
        ...fileInfo,
        // @ts-ignore
        exif: exifInfo,
        thumbnails,
      },
      {
        where: { id: photo.id },
      },
    );
  }
}

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
  const output = path.join(THUMBNAILS_DIR, outputFilename);
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
