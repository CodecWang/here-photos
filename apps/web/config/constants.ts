import { GalleryLayout, GroupBy, NavMode } from '../types/enums';

export const DEFAULT_PHOTOS_LAYOUT: PhotosLayout = {
  groupBy: GroupBy.Day,
  layout: GalleryLayout.Justified,
  spacing: 2,
  size: 220,
};

export const DEFAULT_NAV_MODE = NavMode.Modern;

export const CACHE_KEY = {
  navMode: 'nav-mode',
  groupAlbumsBy: 'group-albums-by',
};
