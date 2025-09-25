import { GalleryLayout, GroupBy, NavMode } from './enums';

export const DEFAULT_PHOTOS_LAYOUT: PhotosLayout = {
  groupBy: GroupBy.None,
  layout: GalleryLayout.Justified,
  spacing: 2,
  size: 220,
  roundedCorner: 0,
};

export const DEFAULT_NAV_MODE = NavMode.Modern;

export const CACHE_KEY = {
  navMode: 'nav-mode',
  groupAlbumsBy: 'group-albums-by',
  albums: 'albums',
};
