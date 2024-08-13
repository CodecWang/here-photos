import { Album } from "@/type";

export function groupAlbumsByYear(rawAlbums: Album[]) {
  const groupedAlbums = rawAlbums.reduce(
    (acc: { [key: string]: Album[] }, album) => {
      const date = new Date(album.createdAt).getFullYear().toString();

      if (!acc[date]) acc[date] = [];
      acc[date].push(album);
      return acc;
    },
    {},
  );

  return Object.entries(groupedAlbums)
    .map(([date, albums]) => ({
      albums,
      title: date,
      count: albums.length,
    }))
    .sort((a, b) => b.title.localeCompare(a.title));
}
