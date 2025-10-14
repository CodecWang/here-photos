import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { IconButton } from '../icon-button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Spinner } from '../ui/spinner';

import DeleteIcon from '~/icons/delete-icon';
import { request } from '~/utils/request';

export default function DeletePhotosModal({
  photoIds,
  onConfirm,
}: {
  photoIds: string[];
  onConfirm?: (photoIds: string[]) => void;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deletePhotos = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setLoading(true);

    const response = await request(`/api/v1/photos`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photoIds }),
    });

    console.log('delete photos response', response);
    if (response && response.count) {
      setLoading(false);
      setOpen(false);
      onConfirm?.(photoIds);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <IconButton
          icon={<DeleteIcon />}
          aria-label={t('action.delete')}
          tooltipContent={t('action.delete')}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('action.delete')}</AlertDialogTitle>
          <AlertDialogDescription>
            Temp: 你将要删除xxx张照片，删除后可以在回收站找回
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('action.close')}</AlertDialogCancel>
          <AlertDialogAction onClick={deletePhotos} disabled={loading}>
            {loading && <Spinner />} {t('action.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
