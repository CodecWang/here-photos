// DTO = Data Transfer Object, used for backend <-> frontend communication
// only includes fields that are safe to expose to frontend
// can be extended with additional fields like photosCount

import z from 'zod';

const nanoidSchema = z.string().length(8);
export const BatchPayloadSchema = z.object({ count: z.number().nonnegative() });

const titleSchema = z.string().min(1).max(64);

// Reference: AlbumModelSchema
export const AlbumDTOSchema = z
  .object({
    albumId: nanoidSchema,
    title: titleSchema,
    coverId: nanoidSchema.nullable(),
    pinned: z.boolean(),
  })
  .strict();

export const AlbumGroupDTOSchema = z.object({
  title: z.string(),
  albums: z.array(
    AlbumDTOSchema.extend({
      createdAt: z.string().nullable(),
      photosCount: z.number().nonnegative(),
    })
  ),
});

export const AlbumReadQueryDTOSchema = z.object({
  groupBy: z.enum(['none', 'year', 'owner']).default('none'),
});

export type AlbumDTO = z.infer<typeof AlbumDTOSchema>;
export type AlbumGroupDTO = z.infer<typeof AlbumGroupDTOSchema>;
export type AlbumReadQueryDTO = z.infer<typeof AlbumReadQueryDTOSchema>;

// Reference: PhotoModelSchema

export const PhotoReadQueryDTOSchema = z.object({
  timeline: z.enum(['none', 'year', 'month', 'day']).default('none'),
  orderBy: z.enum(['createdAt', 'birthTime']).default('birthTime'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const PhotoDTOSchema = z
  .object({
    photoId: nanoidSchema,
    ratio: z.float32(),
    blurHash: z.string().min(10).max(40).nullable(),
    birthTime: z.string().nullable(),
  })
  .strict();

export const PhotoGroupDTOSchema = z.object({
  title: z.string(),
  photos: z.array(PhotoDTOSchema),
});

export const PhotosDTOSchema = z.array(PhotoDTOSchema);

export type PhotoDTO = z.infer<typeof PhotoDTOSchema>;
export type PhotoGroupDTO = z.infer<typeof PhotoGroupDTOSchema>;
export type PhotoReadQueryDTO = z.infer<typeof PhotoReadQueryDTOSchema>;
