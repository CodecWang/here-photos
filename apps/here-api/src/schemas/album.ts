import z from 'zod';

export const albumIdSchema = z.object({
  albumId: z.string().length(8),
});

export const createAlbumSchema = z.object({
  title: z.string().min(1).max(64),
});

export const deleteAlbumsSchema = z.object({
  albumIds: z.array(z.string().length(8)).min(1),
});

export const updateAlbumSchema = z.object({
  title: z.string().min(1).max(64).optional(),
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
export type DeleteAlbumsInput = z.infer<typeof deleteAlbumsSchema>;
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>;
