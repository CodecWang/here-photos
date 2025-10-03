import type { Prisma } from '@prisma/client';
import { prisma } from '../prisma/prisma-instance';

export const PhotoFileDAO = {
  findMany: async (where?: Prisma.PhotoFileWhereInput) => {
    return await prisma.photoFile.findMany({ where });
  },
};
