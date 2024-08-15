import Link from 'next/link';

interface AlbumProps {
  album: Album;
}

export default function Album({ album }: AlbumProps) {
  console.log(album);

  return (
    <Link href={`/albums/${album.id}`}>
      <div className="shadow hover:shadow-2xl">
        <div className="bg-base-200 aspect-square">
          {album.cover && (
            <Image
              src={`/api/v1/photos/${album.cover.id}/thumbnail?variant=2`}
              width={200}
              height={200}
              alt=""
            />
          )}
        </div>
        <div>
          <h3 className="truncate">{album.title}</h3>
          <p>{album.photoCount ? `${album.photoCount} items` : 'Empty'}</p>
        </div>
      </div>
    </Link>
  );
}
