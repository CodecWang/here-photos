import clsx from 'clsx';
import { useState } from 'react';

import { CACHE_KEY } from '~/config/constants';
import ChevronRightIcon from '~/icons/chevron-right-icon';

import Album from './album';

interface AlbumGroupProps {
  title: string;
  count: number;
  albums: Album[];
  collapsed?: boolean;
}

const getIsCollapsed = (title: string) => {
  if (!title) return false;

  if (typeof window !== 'undefined') {
    const albums = localStorage.getItem(CACHE_KEY.albums);
    if (!albums) return false;

    try {
      return JSON.parse(albums)[title].isCollapsed ?? false;
    } catch (error) {
      return false;
    }
  }
  return false;
};

export default function AlbumGroup({ title, count, albums }: AlbumGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(getIsCollapsed(title));

  const toggleCollapse = () => {
    setIsCollapsed(() => {
      const newState = !isCollapsed;
      try {
        const albums = localStorage.getItem(CACHE_KEY.albums) ?? '{}';
        const parsedAlbums = JSON.parse(albums);
        parsedAlbums[title] = {
          ...parsedAlbums[title],
          isCollapsed: newState,
        };
        localStorage.setItem(CACHE_KEY.albums, JSON.stringify(parsedAlbums));
      } catch (error) {
        // Do nothing
      }
      return newState;
    });
  };

  return (
    <div>
      {title && count && (
        <div className="border-base-content/10 mb-4 w-full border-b py-2">
          <div
            className="flex items-center"
            style={{
              animation: 'button-pop var(--animation-btn, 0.25s) ease-out',
            }}
            onClick={toggleCollapse}
          >
            <ChevronRightIcon
              className={clsx(
                'inline-block size-6 transition-all duration-300',
                isCollapsed ? 'rotate-0' : 'rotate-90',
              )}
            />
            <span className="mx-2 text-2xl font-medium">{title}</span>
            <span className="text-base-content/50 mt-1 text-sm">
              ({count} albums)
            </span>
          </div>
        </div>
      )}

      {!isCollapsed && (
        <div
          className="grid grid-cols-[repeat(auto-fill,minmax(min(16rem,100%),1fr))] gap-4"
          style={{
            animation: 'button-pop var(--animation-btn, 0.25s) ease-out',
          }}
        >
          {albums.map((album) => (
            <Album key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}
