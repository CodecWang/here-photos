import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { AlbumUIType } from '~/schemas';

import { Button } from '~/components/ui/button';
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
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Spinner } from '~/components/ui/spinner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { useLocaleDate } from '~/hooks/use-locale-date';
import CreateNewFolderIcon from '~/icons/create-new-folder-icon';
import { request } from '~/utils/request';

export default function CreateAlbumModal() {
  const t = useTranslations();
  const router = useRouter();
  const { formatDate } = useLocaleDate();

  const [open, setOpen] = useState(false);
  const [albumName, setAlbumName] = useState(formatDate(Date.now()));
  const [loading, setLoading] = useState(false);

  const onCreateAlbum = async () => {
    setLoading(true);
    const response = await request<AlbumUIType>(`/api/v1/albums`, {
      method: 'POST',
      body: JSON.stringify({ title: albumName }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response && response.albumId) {
      router.push(`/albums/${response.albumId}`);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full bg-transparent"
              onClick={() => setOpen(true)}
            >
              <CreateNewFolderIcon />
              <span className="hidden md:inline">
                {t('albums.createAlbum')}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('albums.createAlbum')}</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('albums.createAlbum')}</DialogTitle>
          <DialogDescription>TODO(athur)</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">{t('albums.albumName')}</Label>
            <Input
              id="name-1"
              name="name"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('action.close')}</Button>
          </DialogClose>
          <Button
            disabled={loading || !albumName.trim()}
            onClick={onCreateAlbum}
          >
            {loading && <Spinner />} {t('action.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
