import { PhotoResultSchema, AlbumResultSchema } from '@here-photos/db';
import z from 'zod';

export enum TimelineGroup {
  None = 'none',
  Day = 'day',
  Month = 'month',
  Year = 'year',
}

export enum GalleryArrange {
  Grid = 'grid',
  Grid1x1 = 'grid11',
  Justified = 'justified',
  Masonry = 'masonry',
}

export const PhotoUISchema = PhotoResultSchema.extend({
  selected: z.boolean().optional(),
});

export const AlbumUISchema = AlbumResultSchema.extend({
  _count: z
    .object({
      AlbumPhoto: z.number().default(0),
    })
    .optional(),
});

export const PhotosLayoutSchema = z.object({
  folder: z.enum(['none', 'months', 'years']).default('none'),
  spacing: z.number().min(0).max(24).default(2),
  size: z.number().min(100).max(600).default(220),
  roundedCorner: z.number().min(0).max(70).default(0),
  timeline: z.enum(TimelineGroup).default(TimelineGroup.None),
  arrange: z.enum(GalleryArrange).default(GalleryArrange.Justified),
});

export type PhotoUIType = z.infer<typeof PhotoUISchema>;
export type AlbumUIType = z.infer<typeof AlbumUISchema>;
export type PhotosLayoutType = z.infer<typeof PhotosLayoutSchema>;
