import { AlbumDTO } from '@here-photos/dto';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import ChevronRightIcon from '~/icons/chevron-right-icon';

import AlbumUI from './album';

interface AlbumGroupProps {
  title: string;
  count: number;
  albums: AlbumDTO[];
}

export default function AlbumGroup({ title, count, albums }: AlbumGroupProps) {
  const t = useTranslations();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div>
      {title && count > 0 && (
        <div className="mb-4 w-full border-b border-secondary py-2">
          <div className="flex items-center">
            <button
              className="btn btn-circle btn-ghost"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronRightIcon
                className={clsx(
                  'inline-block size-6 transition-all duration-300',
                  isCollapsed ? 'rotate-0' : 'rotate-90'
                )}
              />
            </button>

            <span className="mx-2 text-2xl font-semibold">{title}</span>
            <span className="text-secondary mt-1 text-sm">
              {t('albums.albumsCount', { count })}
            </span>
          </div>
        </div>
      )}

      {!isCollapsed && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))] gap-4">
          {albums.map((album) => (
            <AlbumUI key={album.albumId} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}
