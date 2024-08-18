import Link from 'next/link';
import Image from 'next/image';

interface AlbumProps {
  album: Album;
}

export default function Album({ album }: AlbumProps) {
  return (
    <Link href={`/albums/${album.id}`}>
      <div className="shadow hover:shadow-2xl">
        <div className="bg-base-200 relative aspect-square">
          {album.cover && (
            <Image
              src={`/api/v1/photos/${album.cover.id}/thumbnail?variant=2`}
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
