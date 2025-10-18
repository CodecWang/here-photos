import { AlbumDTO, AlbumGroupDTO } from '@here-photos/dto';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Label } from '~/components/ui/label';
import { Spinner } from '~/components/ui/spinner';
import { useLocaleDate } from '~/hooks/use-locale-date';
import CreateNewFolderIcon from '~/icons/create-new-folder-icon';
import { request } from '~/utils/request';

import { IconButton } from '../icon-button';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

interface AddToAlbumModalProps {
  photoIds: string[];
  onConfirm?: () => void;
}

export default function AddToAlbumModal({ photoIds }: AddToAlbumModalProps) {
  const t = useTranslations();
  const { formatDate } = useLocaleDate();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [albums, setAlbums] = useState<AlbumDTO[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>();

  useEffect(() => {
    (async () => {
      const albumGroups = await request<AlbumGroupDTO[]>('/api/v1/albums');
      if (albumGroups) {
        setAlbums(albumGroups.flatMap((group) => group.albums) ?? []);
      }
    })();
  }, []);

  const addToAlbum = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton
          aria-label={t('photos.addToAlbum')}
          tooltipContent={t('photos.addToAlbum')}
          icon={<CreateNewFolderIcon />}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl sm:rounded-3xl">
        <DialogHeader>
          <DialogTitle>{t('photos.addToAlbum')}</DialogTitle>
          <DialogDescription>TODO(athur)</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            {albums.map((album) => (
              <div className="flex items-start gap-3" key={album.albumId}>
                <Checkbox
                  id={`album-${album.albumId}`}
                  onCheckedChange={(checked) =>
                    setSelectedAlbumId(checked ? album.albumId : undefined)
                  }
                />
                <div className="grid gap-2">
                  <Label htmlFor={`album-${album.albumId}`}>
                    {album.title}
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    {t('albums.countAndCreatedAt', {
                      count: album.photosCount || 0,
                      createdAt: formatDate(album.createdAt),
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="rounded-full">
              {t('action.close')}
            </Button>
          </DialogClose>
          <Button
            disabled={loading || !selectedAlbumId}
            onClick={addToAlbum}
            className="rounded-full"
          >
            {loading && <Spinner />} {t('action.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
