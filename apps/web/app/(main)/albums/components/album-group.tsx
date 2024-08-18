import { useEffect, useState } from 'react';

import ChevronRightIcon from '@/icons/chevron-right-icon';

import Album from './album';
import clsx from 'clsx';

interface AlbumGroupProps {
  title: string;
  count: number;
  albums: Album[];
  collapsed?: boolean;
}

export default function AlbumGroup({ title, count, albums }: AlbumGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  useEffect(() => setIsCollapsed(false), [albums]);

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
          {albums.map((album, index) => (
            <Album key={index} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}
