import { Prisma, QueueTask } from '@prisma/client';
import { prisma } from '../prisma/prisma-instance';

export const QueueTaskDAO = {
  findByTaskId: async (taskId: string) => {
    return await prisma.queueTask.findUniqueOrThrow({ where: { taskId } });
  },
  create: async (data: Prisma.QueueTaskCreateInput) => {
    return await prisma.queueTask.create({ data });
  },
  update: async (taskId: string, data: Partial<QueueTask>) => {
    return await prisma.queueTask.update({ where: { taskId }, data });
  },
};
