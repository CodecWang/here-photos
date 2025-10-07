import { prisma } from '../prisma/prisma-instance';

import type { Prisma } from '@prisma/client';

export const PhotoDAO = {
  findByHash: async (hash?: string) => {
    // TODO(arthur): only select id info to optimize
    // const existingPhoto = await prisma.photo.findFirst({
    //   where: { hash: file.hash },
    //   select: {
    //     id: true,
    //     photoId: true,
    //     hash: true,
    //     Exif: { select: { id: true } },
    //     Thumbnail: { select: { id: true } },
    //   },
    // });
    if (!hash) return null;
    return await prisma.photo.findUnique({
      where: { hash },
      include: { Exif: true, Thumbnail: true, PhotoFile: true },
    });
  },
  findByPhotoId: async (photoId: string) => {
    // TODO(arthur): unify whether throw or not.
    return await prisma.photo.findUniqueOrThrow({
      where: { photoId },
      include: { Exif: true, Thumbnail: true, PhotoFile: true },
    });
  },
  // TODO(arthur): redesign ado interface, like simplify: findMany(args) -> prisma.findMany(args)
  findMany: async (
    where?: Prisma.PhotoWhereInput,
    include?: Prisma.PhotoInclude,
    orderBy?: Prisma.PhotoOrderByWithRelationInput
  ) => {
    return await prisma.photo.findMany({
      where,
      include: include || { Exif: true, Thumbnail: true, PhotoFile: true },
      orderBy: orderBy || { birthTime: 'desc' },
    });
  },
  create: async (data: Prisma.PhotoCreateInput) => {
    return await prisma.photo.create({ data });
  },
  update: async (id: number, data: Prisma.PhotoUpdateInput) => {
    return await prisma.photo.update({ where: { id }, data });
  },
  deleteManyByPhotoIds: async (photoIds: string[]) => {
    return await prisma.photo.deleteMany({
      where: { photoId: { in: photoIds } },
    });
  },
};
