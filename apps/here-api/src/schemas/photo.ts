import z from 'zod';

const PersistentFileSchema = z.object({
  filepath: z.string(),
  originalFilename: z.string().optional(),
  mimetype: z.string().optional(),
  size: z.number().optional(),
});

export const nanoId8Schema = z.object({
  taskId: z.string().length(8),
});

export const photoIdSchema = z.object({
  photoId: z.string().length(8),
});

export const thumbnailTypeSchema = z.object({
  type: z.enum(['sm', 'md', 'lg']),
});

export const deletePhotosSchema = z.object({
  photoIds: z.array(z.string().length(8)).min(1),
});

export const uploadPhotosSchema = z.object({
  files: z.union([
    PersistentFileSchema,
    z.array(PersistentFileSchema).nonempty(),
  ]),
  albumIds: z.array(z.string().length(8)).optional(),
});

export type DeletePhotosInput = z.infer<typeof deletePhotosSchema>;
export type UploadPhotosInput = z.infer<typeof uploadPhotosSchema>;
