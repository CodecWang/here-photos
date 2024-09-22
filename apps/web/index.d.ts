/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

interface PhotosLayout {
  groupBy?: GroupBy;
  layout?: GalleryLayout;
  spacing?: number;
  size?: number;
  cornerRadius?: number;
}

interface Photo {
  id: number;
  title: string;
  shotTime: Date;
  blurHash: string;
  aiDesc?: string;
  thumbnails: any[];
}

interface PhotoGroup {
  title: string;
  photos: Photo[];
}

interface Album {
  id: number;
  title: string;
  cover: Photo;
  photoCount?: number;
  photos: Photo[];
  createdAt: Date;
}

interface AlbumGroup {
  title: string;
  count: number;
  albums: Album[];
}
