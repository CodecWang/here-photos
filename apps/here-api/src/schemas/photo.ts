import z from 'zod';

export const scanTaskIdSchema = z.object({
  taskId: z.string().length(8),
});

export const photoIdSchema = z.object({
  photoId: z.string().length(8),
});

export const deletePhotosSchema = z.object({
  photoIds: z.array(z.string().length(8)).min(1),
});

export type DeletePhotosInput = z.infer<typeof deletePhotosSchema>;
