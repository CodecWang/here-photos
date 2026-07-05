import { AlbumDTO } from '@here-photos/dto';
import { useSetAtom } from 'jotai';
import Image, { ImageLoaderProps } from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { albumActionsAtom } from '~/atoms';
import { IconButton } from '~/components/icon-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import MoreVertIcon from '~/icons/more-vert-icon';
import { cn } from '~/lib/utils';

import DeleteAlbumModal from './delete-album-modal';

interface AlbumProps {
  album: AlbumDTO;
  showCount?: boolean;
  showTitle?: boolean;
  showActions?: boolean;
}

export default function Album({
  album,
  showCount = true,
  showTitle = true,
  showActions = true,
}: AlbumProps) {
  const t = useTranslations();
  const setActions = useSetAtom(albumActionsAtom);
  const [moreOpen, setMoreOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const onTogglePin = () => {
    fetch(`/api/v1/albums/${album.albumId}`, {
      method: 'PUT',
      body: JSON.stringify({ pinned: !album.pinned }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setActions({ type: 'togglePinned', payload: { albumId: album.albumId } });
  };

  return (
    <div className="relative group">
      <Link href={`/albums/${album.albumId}`}>
        <>
          <div className="rounded-2xl relative overflow-hidden aspect-square">
            {album.coverId && (
              <Image
                loader={({ src }: ImageLoaderProps) => src}
                src={`/api/v1/photos/${album.coverId}/thumbnails?type=md`}
                fill={true}
                style={{ objectFit: 'cover' }}
                alt={album.title}
              />
            )}
          </div>

          {(showTitle || showCount) && (
            <div className="p-2" onClick={(e) => e.preventDefault()}>
              {showTitle && <h3 className="truncate">{album.title}</h3>}
              {showCount && (
                <span className="text-xs text-muted-foreground block">
                  {album.photosCount
                    ? t('albums.photosCount', { count: album.photosCount })
                    : t('albums.noPhotos')}
                </span>
              )}
            </div>
          )}
        </>
      </Link>

      {showActions && (
        <DropdownMenu modal={false} open={moreOpen} onOpenChange={setMoreOpen}>
          <DropdownMenuTrigger asChild>
            <div
              className={cn(
                'absolute right-2 top-2 transition-opacity duration-200',
                moreOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
            >
              <IconButton
                active={true}
                icon={<MoreVertIcon />}
                aria-label={t('action.more')}
                tooltipContent={t('action.more')}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onTogglePin}>
              {album.pinned ? t('action.unpin') : t('action.pin')}
            </DropdownMenuItem>
            <DropdownMenuItem>{t('action.rename')}</DropdownMenuItem>
            <DropdownMenuItem>{t('action.share')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
              {t('action.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DeleteAlbumModal
        album={album}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />
    </div>
  );
}
