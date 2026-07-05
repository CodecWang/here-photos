import { prisma } from '../prisma/prisma-instance';

export const SettingDAO = {
  getSettings: async () => {
    return await prisma.setting.findMany();
  },

  getSettingByKey: async (key: string) => {
    return await prisma.setting.findFirst({
      where: { key },
      select: { value: true },
    });
  },

  updateSetting: async (key: string, value: string) => {
    return await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  },
};
