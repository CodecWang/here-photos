import Link from 'next/link';
import { useState } from 'react';

import ChevronRightIcon from '@/icons/chevron-right-icon';

interface AlbumGroupProps {
  title: string;
  count: number;
  albums: Album[];
}

export default function AlbumGroup({ title, count, albums }: AlbumGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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
          className="flex flex-wrap"
          style={{
            animation: 'button-pop var(--animation-btn, 0.25s) ease-out',
          }}
        >
          {albums.map((album, index) => (
            <Link href={`/albums/${album.id}`} key={index}>
              <div className="card m-4 w-64 bg-base-100 shadow-xl">
                <figure>
                  <img
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                    }}
                    src={
                      album.cover
                        ? `/api/v1/photos/${album.cover.id}/thumbnail?variant=2`
                        : ''
                    }
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{album.title}</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
