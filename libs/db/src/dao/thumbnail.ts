import { Prisma } from '@prisma/client';

import { prisma } from '../prisma/prisma-instance';

export const ThumbnailDAO = {
  findByPhotoIdAndType: async (where: Prisma.ThumbnailWhereInput) => {
    return await prisma.thumbnail.findFirstOrThrow({
      where,
    });
  },
};
