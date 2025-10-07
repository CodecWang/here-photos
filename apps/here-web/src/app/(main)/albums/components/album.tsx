import Image, { ImageLoaderProps } from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import IconButton from '~/components/ui/icon-button';
import KeepIcon from '~/icons/keep-icon';
import KeepOffIcon from '~/icons/keep-off-icon';

interface AlbumProps {
  album: Album;
  showPhotosCount?: boolean;
  showPinButton?: boolean;
}

export default function Album({
  album,
  showPhotosCount = true,
  showPinButton = true,
}: AlbumProps) {
  const t = useTranslations();
  return (
    <Link href={`/albums/${album.id}`}>
      <div className="rounded-3xl relative overflow-hidden shadow hover:shadow-2xl group aspect-square">
        {album.cover && (
          <Image
            loader={({ src }: ImageLoaderProps) => src}
            src={`/api/v1/photos/${album.cover.id}/thumbnails?type=md`}
            fill={true}
            style={{ objectFit: 'cover' }}
            alt={album.title}
          />
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="truncate font-bold text-white">{album.title}</h3>
          {showPhotosCount && (
            <span className="text-white/80 text-sm block sm:hidden sm:group-hover:block">
              {album.photoCount ? `${album.photoCount} photos` : 'Empty'}
            </span>
          )}
        </div>

        {showPinButton && (
          <IconButton
            tooltip={album.pinned ? t('action.unpin') : t('action.pin')}
            className="absolute right-2 bottom-2 block sm:hidden sm:group-hover:block"
            icon={
              album.pinned ? (
                <KeepOffIcon className="size-5 rotate-45" />
              ) : (
                <KeepIcon className="size-5 rotate-45" />
              )
            }
            onClick={(e) => {
              e.preventDefault();
              console.log('clicked');
            }}
          />
        )}
      </div>
    </Link>
  );
}
