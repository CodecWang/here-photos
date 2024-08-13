import { GalleryLayout, GroupBy } from '../types/enums';

export const DEFAULT_PHOTOS_LAYOUT: PhotosLayout = {
  groupBy: GroupBy.Day,
  layout: GalleryLayout.Justified,
  spacing: 2,
  size: 220,
};

export const CACHE_KEY = {
  groupAlbumsBy: 'group-albums-by',
};
