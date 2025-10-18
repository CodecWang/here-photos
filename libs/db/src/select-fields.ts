import { Prisma } from '@prisma/client';

export const albumSelect = {
  albumId: true,
  title: true,
  coverId: true,
  pinned: true,
} as const satisfies Prisma.AlbumSelect;

export const albumSelectWithPhotosCount = {
  ...albumSelect,
  createdAt: true,
  _count: {
    select: { AlbumPhoto: true },
  },
} as const satisfies Prisma.AlbumSelect;

export const photoSelect = {
  photoId: true,
  blurHash: true,
  birthTime: true,
  ratio: true,
} as const satisfies Prisma.PhotoSelect;
