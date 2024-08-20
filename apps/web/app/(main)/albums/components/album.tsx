import Image from 'next/image';
import Link from 'next/link';

interface AlbumProps {
  album: Album;
}

export default function Album({ album }: AlbumProps) {
  return (
    <Link href={`/albums/${album.id}`}>
      <div className="rounded-box overflow-hidden shadow hover:shadow-2xl">
        <div className="bg-base-200 relative aspect-square">
          {album.cover && (
            <Image
              src={`/api/v1/photos/${album.cover.id}/thumbnail?variant=2`}
              fill={true}
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt=""
            />
          )}
        </div>
        <div className="px-4 py-2">
          <h3 className="truncate text-lg">{album.title}</h3>
          <span className="text-base-content/50 text-sm">
            {album.photoCount ? `${album.photoCount} photos` : 'Empty'}
          </span>
        </div>
      </div>
    </Link>
  );
}
