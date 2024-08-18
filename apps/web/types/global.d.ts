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
  thumbnails: any[];
}

interface PhotoGroup {
  title: string;
  photos: Photo[];
}
