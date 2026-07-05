import z from 'zod';

// Reference: SettingModelSchema

export const settingDTOSchema = z.object({
  photoDirs: z.array(z.string()).min(1),
});

export type SettingDTO = z.infer<typeof settingDTOSchema>;
