import { useEffect, useState } from 'react';

import ChevronRightIcon from '@/icons/chevron-right-icon';

import Album from './components/album';

interface AlbumGroupProps {
  title: string;
  count: number;
  albums: Album[];
  collapsed?: boolean;
}

export default function AlbumGroup({ title, count, albums }: AlbumGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    setIsCollapsed(false);
  }, [albums]);

  return (
    <div>
      {title && count && (
        <div className="w-full border-b border-b-blue-100 p-2">
          <div
            className="flex items-center"
            style={{
              animation: 'button-pop var(--animation-btn, 0.25s) ease-out',
            }}
            onClick={toggleCollapse}
          >
            <ChevronRightIcon
              className={`inline-block size-6 ${
                isCollapsed ? 'rotate-0' : 'rotate-90'
              } transition-all duration-[250ms]`}
            />
            <span className="text-3xl">{title}</span>
            <span className="self-end">{count} albums</span>
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
