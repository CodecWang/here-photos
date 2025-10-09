'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import CloseIcon from '~/icons/close-icon';
import DeleteIcon from '~/icons/delete-icon';

import { IconButton } from '../icon-button';

interface PhotoViewerProps {
  photoId: string;
}

export default function PhotoViewer(props: PhotoViewerProps) {
  const t = useTranslations();
  const { photoId } = props;

  const router = useRouter();

  const deletePhoto = async () => {
    if (!photoId) return;

    await fetch('/api/v1/photos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photoIds: [photoId] }),
    });
  };

  if (!photoId) return null;

  return (
    <div className="bg-background fixed left-0 top-0 z-30 h-full w-full">
      <IconButton
        icon={<CloseIcon />}
        className="absolute left-2 top-2"
        aria-label={t('action.close')}
        tooltipContent={t('action.close')}
        onClick={() => router.back()}
      />
      <div className="flex h-full flex-col items-center justify-center">
        <img
          src={`/api/v1/photos/${photoId}/thumbnails?type=md`}
          alt=""
          className="max-h-full max-w-full"
        />
      </div>

      <div className="absolute right-2 top-2">
        <IconButton
          tooltip={t('action.delete')}
          onClick={deletePhoto}
          icon={<DeleteIcon className="size-5" />}
        />
      </div>
    </div>
  );
}
