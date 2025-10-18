import { AlbumDTO } from '@here-photos/dto';
import { useSetAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { albumActionsAtom } from '~/atoms';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { Spinner } from '~/components/ui/spinner';
import { request } from '~/utils/request';

interface DeleteAlbumModalProps {
  album: AlbumDTO;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DeleteAlbumModal({
  album,
  open,
  setOpen,
}: DeleteAlbumModalProps) {
  const t = useTranslations();
  const setActions = useSetAtom(albumActionsAtom);
  const [loading, setLoading] = useState(false);

  const deleteAlbum = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setLoading(true);
    const response = await request(`/api/v1/albums`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ albumIds: [album.albumId] }),
    });

    console.log('>>> response:', response);
    // TODO(arthur): hanle response check
    if (response && response.count) {
      setActions({ type: 'delete', payload: { albumId: album.albumId } });
    }
    setOpen(false);
    setLoading(false);
    // redirect to albums page
    // window.location.href = '/albums';
    // response && router.replace('/albums/');
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('albums.deleteAlbum')}</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting an album is permanent. Photos and videos that were in a
            deleted album remain in Here Photos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('action.close')}</AlertDialogCancel>
          <AlertDialogAction onClick={deleteAlbum} disabled={loading}>
            {loading && <Spinner />} {t('action.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
