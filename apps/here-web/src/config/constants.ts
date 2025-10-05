import { GalleryLayout, GroupBy } from './enums';

export const DEFAULT_PHOTOS_LAYOUT: PhotosLayout = {
  groupBy: GroupBy.None,
  layout: GalleryLayout.Justified,
  spacing: 2,
  size: 220,
  roundedCorner: 0,
};

export const CACHE_KEY = {
  navMode: 'nav-mode',
  groupAlbumsBy: 'group-albums-by',
  albums: 'albums',
};
