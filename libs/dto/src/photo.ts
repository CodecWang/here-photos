import z from 'zod';

import { nanoidSchema } from './common';

// Reference: PhotoModelSchema

export const photoReadQueryDTOSchema = z.object({
  timeline: z.enum(['none', 'year', 'month', 'day']).default('none'),
  orderBy: z.enum(['createdAt', 'birthTime']).default('birthTime'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const photoDTOSchema = z
  .object({
    photoId: nanoidSchema,
    ratio: z.float32(),
    blurHash: z.string().min(10).max(40).nullable(),
    birthTime: z.string().nullable(),
  })
  .strict();

export const photoGroupDTOSchema = z.object({
  title: z.string(),
  photos: z.array(photoDTOSchema),
});

export const PhotosDTOSchema = z.array(photoDTOSchema);

export type PhotoDTO = z.infer<typeof photoDTOSchema>;
export type PhotoGroupDTO = z.infer<typeof photoGroupDTOSchema>;
export type PhotoReadQueryDTO = z.infer<typeof photoReadQueryDTOSchema>;
