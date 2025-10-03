import z from 'zod';

export enum QueueStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export const PhotoSchema = z.object({
  photoId: z.string().length(8),
  hash: z.string().min(1),
  blurHash: z.string().min(1),
  birthTime: z.date(),
  modifiedTime: z.date(),
});

export const ThumbnailSchema = z.object({
  type: z.enum(['sm', 'md', 'lg']),
  size: z.number().int().nonnegative(),
  filePath: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  format: z.string().min(1),
});

export const ExifSchema = z.object({
  shotTime: z.date().optional(),
  cameraMake: z.string().min(1).optional(),
  cameraModel: z.string().min(1).optional(),
  iso: z.number().int().positive().optional(),
  gpsLatitude: z.number().optional(),
  gpsLongitude: z.number().optional(),
});

export const QueueTaskSchema = z.object({
  id: z.number().int(),
  taskId: z.string(),
  type: z.string(),
  status: z.enum(QueueStatus).default(QueueStatus.PENDING),
  total: z.number().int(),
  processed: z.number().int(),
  success: z.number().int(),
  failed: z.number().int(),
  skipped: z.number().int(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
});

export type Photo = z.infer<typeof PhotoSchema>;
export type Thumbnail = z.infer<typeof ThumbnailSchema>;
export type Exif = z.infer<typeof ExifSchema>;
export type QueueTask = z.infer<typeof QueueTaskSchema>;
