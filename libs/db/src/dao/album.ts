import { Prisma } from '@prisma/client';

import { prisma } from '../prisma/prisma-instance';

export const AlbumDAO = {
  findMany: async () => {
    return await prisma.album.findMany({
      include: {
        _count: {
          // TODO(arthur): validate here
          select: { AlbumPhoto: true },
        },
      },
    });
  },
  // TODO(arthur): createTimeAt/updateTimeAt is not local time
  create: async (data: Prisma.AlbumCreateInput) => {
    return await prisma.album.create({ data });
  },
  update: async (id: string, data: Prisma.AlbumUpdateInput) => {
    return await prisma.album.update({ where: { albumId: id }, data });
  },
  deleteManyByAlbumIds: async (ids: string[]) => {
    return await prisma.album.deleteMany({ where: { albumId: { in: ids } } });
  },
  findPhotosByAlbumId: async (albumId: string) => {
    return await prisma.album.findFirstOrThrow({
      where: { albumId },
      include: {
        AlbumPhoto: {
          include: {
            Photo: true,
          },
        },
      },
    });
  },
  addPhotos: async (albumId: string, photoIds: string[]) => {
    return await prisma.$transaction(async (tx) => {
      return await tx.albumPhoto.createMany({
        data: photoIds.map((photoId) => ({
          albumId: albumId,
          photoId,
        })),
        skipDuplicates: true,
      });
    });
  },
};
