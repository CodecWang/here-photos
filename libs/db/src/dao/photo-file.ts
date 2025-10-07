import { prisma } from '../prisma/prisma-instance';

import type { Prisma } from '@prisma/client';

export const PhotoFileDAO = {
  findMany: async (where?: Prisma.PhotoFileWhereInput) => {
    return await prisma.photoFile.findMany({ where });
  },
};
