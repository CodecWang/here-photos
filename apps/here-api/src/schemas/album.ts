// import { z } from 'zod';

import z from 'zod';

const nanoidSchema = z.string().length(8);
export const BatchPayloadSchema = z.object({ count: z.number().nonnegative() });

const titleSchema = z.string().min(1).max(64);

export const AlbumCreateBodySchema = z.object({
  title: titleSchema,
});

export const AlbumReadParamsSchema = z.object({
  albumId: nanoidSchema,
});

export const AlbumUpdateParamsSchema = z.object({
  albumId: nanoidSchema,
});

export const AlbumUpdateBodySchema = z.object({
  title: titleSchema.optional(),
});

export const AlbumsDeleteBodySchema = z.object({
  albumIds: z.array(nanoidSchema).min(1),
});

export const AlbumAddPhotosBodySchema = z.object({
  photoIds: z.array(nanoidSchema).min(1),
});
