import z from 'zod';

const nanoidSchema = z.string().length(8);
export const BatchPayloadSchema = z.object({ count: z.number().nonnegative() });

const titleSchema = z.string().min(1).max(64);

export const albumCreateBodySchema = z.object({
  title: titleSchema,
});

export const albumReadParamsSchema = z.object({
  albumId: nanoidSchema,
});

export const albumUpdateParamsSchema = z.object({
  albumId: nanoidSchema,
});

export const albumUpdateBodySchema = z.object({
  title: titleSchema.optional(),
  pinned: z.boolean().optional(),
});

export const albumsDeleteBodySchema = z.object({
  albumIds: z.array(nanoidSchema).min(1),
});

export const albumAddPhotosBodySchema = z.object({
  photoIds: z.array(nanoidSchema).min(1),
});
