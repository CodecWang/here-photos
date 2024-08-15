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
