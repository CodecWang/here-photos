import { AlbumDTO, AlbumGroupDTO } from '@here-photos/dto';
import { useAtom, useSetAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

import Album from '~/app/(main)/albums/components/album';
import { morpherActionAtom, selectedPhotoIdsAtom } from '~/atoms';
import { useLocaleDate } from '~/hooks/use-locale-date';
import CloseIcon from '~/icons/close-icon';
import { cn } from '~/lib/utils';
import { request } from '~/utils/request';

import { IconButton } from '../icon-button';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Spinner } from '../ui/spinner';

export default function MorpherAddToAlbums() {
  const t = useTranslations();
  const { formatDate } = useLocaleDate();
  const [morpherAction, setMorpherAction] = useAtom(morpherActionAtom);
  const [selectedPhotoIds, setSelectedPhotoIds] = useAtom(selectedPhotoIdsAtom);
  const [loading, setLoading] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>();

  const [albums, setAlbums] = useState<AlbumDTO[]>([]);
  useEffect(() => {
    (async () => {
      const albumGroups = await request<AlbumGroupDTO[]>('/api/v1/albums');
      if (albumGroups) {
        setAlbums(albumGroups.flatMap((group) => group.albums) ?? []);
      }
    })();
  }, []);

  const addToAlbum = async () => {
    setLoading(true);
    const response = await request(`/api/v1/albums/${selectedAlbumId}/photos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photoIds }),
    });

    if (response) {
      setOpen(false);
      setLoading(false);

      toast.success(
        t('albums.addPhotosSuccess', {
          count: photoIds.length,
          albumName: 'response.title',
        })
      );
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <h1 className="text-xl">{t('photos.addToAlbum')}</h1>
        <div
          className={cn(
            'flex',
            morpherAction === 'add-to-albums-expanded'
              ? 'flex gap-4 mt-4'
              : 'flex-col mt-4'
          )}
        >
          {albums.map((album) => (
            <div className="flex items-start gap-3" key={album.albumId}>
              {morpherAction === 'add-to-albums-expanded' ? (
                <Album album={album} showActions={false} />
              ) : (
                <div className="hover:bg-secondary w-full p-2 rounded-lg cursor-pointer">
                  <Checkbox
                    id={`album-${album.albumId}`}
                    onCheckedChange={(checked) =>
                      setSelectedAlbumId(checked ? album.albumId : undefined)
                    }
                  />
                  <Label htmlFor={`album-${album.albumId}`}>
                    {album.title}
                  </Label>
                </div>
              )}
            </div>
          ))}
        </div>
        <Button
          className="rounded-full w-full mt-6"
          onClick={addToAlbum}
          disabled={loading}
        >
          {loading && <Spinner />} {t('action.confirm')}
        </Button>
        <Button
          className="rounded-full w-full mt-6"
          onClick={() =>
            setMorpherAction(
              morpherAction === 'add-to-albums-expanded'
                ? 'add-to-albums'
                : 'add-to-albums-expanded'
            )
          }
        >
          {t('action.confirm')}
        </Button>
      </div>

      <div className="p-4 border-t flex justify-center">
        <IconButton
          active={true}
          icon={<CloseIcon />}
          aria-label={t('action.close')}
          tooltipContent={t('action.close')}
          onClick={() => setMorpherAction('nav-bar')}
        />
      </div>
    </div>
  );
}
