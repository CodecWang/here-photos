import Image, { ImageLoaderProps } from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import IconButton from '~/components/ui/icon-button';
import CheckIcon from '~/icons/check-icon';
// import { AlbumOptionsDropdown } from './album-options-dropdown';

interface AlbumProps {
  album: Album;
}

export default function Album({ album }: AlbumProps) {
  const t = useTranslations();
  return (
    <Link href={`/albums/${album.id}`}>
      <div className="rounded-box relative overflow-hidden shadow hover:shadow-2xl">
        <div className="bg-base-200 relative aspect-square">
          {album.cover && (
            <Image
              loader={({ src }: ImageLoaderProps) => src}
              src={`/api/v1/photos/${album.cover.id}/thumbnail?variant=2`}
              fill={true}
              style={{ objectFit: 'cover' }}
              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

        <IconButton
          tooltip={t('action.confirm')}
          className="absolute right-2 top-2"
          // onClick={addNewDirectory}
          icon={<CheckIcon className="size-5" />}
        />

        {/* <AlbumOptionsDropdown /> */}
      </div>
    </Link>
  );
}
