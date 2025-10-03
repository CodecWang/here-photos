import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  // TODO(arthur): different log level for dev and prod, log system.
  // log: ['query', 'info', 'warn', 'error'],
});
