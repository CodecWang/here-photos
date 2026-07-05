// DTO = Data Transfer Object, used for backend <-> frontend communication
// only includes fields that are safe to expose to frontend
// can be extended with additional fields like photosCount

import z from 'zod';

const nanoidSchema = z.string().length(8);
export const BatchPayloadSchema = z.object({ count: z.number().nonnegative() });

const titleSchema = z.string().min(1).max(64);

// Reference: AlbumModelSchema
export const albumDTOSchema = z
  .object({
    albumId: nanoidSchema,
    title: titleSchema,
    coverId: nanoidSchema.nullable(),
    pinned: z.boolean(),
  })
  .strict();

export const albumGroupDTOSchema = z.object({
  title: z.string(),
  albums: z.array(
    albumDTOSchema.extend({
      createdAt: z.string().nullable(),
      photosCount: z.number().nonnegative(),
    })
  ),
});

export const AlbumReadQueryDTOSchema = z.object({
  groupBy: z.enum(['none', 'year', 'owner']).default('none'),
});

export type AlbumDTO = z.infer<typeof albumDTOSchema>;
export type AlbumGroupDTO = z.infer<typeof albumGroupDTOSchema>;
export type AlbumReadQueryDTO = z.infer<typeof AlbumReadQueryDTOSchema>;
