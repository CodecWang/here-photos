export enum GroupAlbumsBy {
  None = "No grouping",
  Year = "Group by year",
  Owner = "Group by owner",
}

interface Album {
  id: number;
  title: string;
  cover: Photo;
  photos: Photo[];
  createdAt: Date;
}

interface AlbumGroup {
  title: string;
  count: number;
  albums: Album[];
}
