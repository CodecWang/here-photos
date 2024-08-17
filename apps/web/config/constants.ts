import { GalleryLayout, GroupBy } from '../types/enums';

export const DEFAULT_PHOTOS_LAYOUT: PhotosLayout = {
  groupBy: GroupBy.Day,
  layout: GalleryLayout.Grid1x1,
  spacing: 2,
  size: 220,
};

export const CACHE_KEY = {
  groupAlbumsBy: 'group-albums-by',
};
