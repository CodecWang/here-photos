import { Prisma } from '@prisma/client';

import { prisma } from '../prisma/prisma-instance';
import {
  albumSelect,
  albumSelectWithPhotosCount,
  photoSelect,
} from '../select-fields';

export const AlbumDAO = {
  read: async (photoId: string) => {
    return await prisma.album.findUnique({
      where: { albumId: photoId },
      select: albumSelect,
    });
  },

  create: async (data: Prisma.AlbumCreateInput) => {
    return await prisma.album.create({ data, select: albumSelect });
  },

  update: async (id: string, data: Prisma.AlbumUncheckedUpdateInput) => {
    return await prisma.album.update({
      where: { albumId: id },
      data,
      select: albumSelect,
    });
  },

  // Simplified version of getAlbums()
  // getAlbums: async (): Promise<AlbumBaseType[]> => {
  //   return await prisma.album.findMany({
  //     select: albumSelect,
  //   });
  // },

  // More flexible version of getAlbums(): can pass in args like orderBy, where, etc.
  getAlbums<T extends Prisma.AlbumFindManyArgs = Prisma.AlbumFindManyArgs>(
    args?: Omit<T, 'select'>
  ): Promise<
    Prisma.AlbumGetPayload<{ select: typeof albumSelectWithPhotosCount }>[]
  > {
    return prisma.album.findMany({
      select: albumSelectWithPhotosCount,
      ...(args ?? {}),
    });
  },

  deleteAlbums: async (albumIds: string[]): Promise<Prisma.BatchPayload> => {
    return await prisma.album.deleteMany({
      where: { albumId: { in: albumIds } },
    });
  },

  getPhotos: async (albumId: string) => {
    return await prisma.photo.findMany({
      where: { AlbumPhoto: { some: { albumId } } },
      orderBy: { createdAt: 'desc' },
      select: photoSelect,
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
