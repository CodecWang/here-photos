'use client';

import { useAtomValue } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo } from 'react';

import { IconButton } from '../icon-button';

import { photosAtom } from '~/atoms';
import ChevronRightIcon from '~/icons/chevron-right-icon';
import CloseIcon from '~/icons/close-icon';
import DeleteIcon from '~/icons/delete-icon';

interface PhotoViewerProps {
  photoId: string;
  albumId?: string;
}

export default function PhotoViewer(props: PhotoViewerProps) {
  const { albumId, photoId } = props;

  const router = useRouter();
  const t = useTranslations();
  const photos = useAtomValue(photosAtom);

  const { currentIndex, currentPhoto, nextPhoto, prevPhoto } = useMemo(() => {
    const index = photos.findIndex((p) => p.photoId === photoId);
    return {
      currentIndex: index,
      currentPhoto: photos[index],
      nextPhoto: photos[index + 1],
      prevPhoto: photos[index - 1],
    };
  }, [photos, photoId]);
  console.log('>>>> PhotoViewer', { albumId, photoId, currentPhoto, photos });

  const deletePhoto = useCallback(async () => {
    if (!photoId) return;

    const response = await fetch('/api/v1/photos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photoIds: [photoId] }),
    });

    router.back();
  }, [photoId, router]);

  const goTo = useCallback(
    (dir: number) => {
      const newIndex = currentIndex + dir;
      const target = photos[newIndex];
      if (!target) return;

      console.log('>>>> go to');
      router.replace(
        albumId
          ? `/albums/${albumId}/photos/${target.photoId}`
          : `/photos/${target.photoId}`
      );
    },
    [currentIndex, photos, albumId, router]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;

      // Ignore when user is typing in an input/textarea or contentEditable element
      const tag = target?.tagName;
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        (target?.isContentEditable ?? false)
      ) {
        return;
      }

      if (e.key === 'Escape') router.back();
      else if (e.key === 'ArrowLeft') goTo(-1);
      else if (e.key === 'ArrowRight') goTo(1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goTo, router]);

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
      <div className="flex h-full justify-center">
        {/* <img
          src={`/api/v1/photos/${photoId}/thumbnails?type=md`}
          alt=""
          className="max-h-full max-w-full object-contain"
        /> */}

        <Image
          src={`/api/v1/photos/${photoId}/thumbnails?type=md`}
          alt={'photo.photoId'}
          fill={true}
          // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="empty"
          // className="cursor-pointer transition-normal duration-500 hover:shadow-2xl"
          style={{
            objectFit: 'contain',
          }}
        />
      </div>
      <div className="absolute right-2 top-2">
        <IconButton
          icon={<DeleteIcon />}
          aria-label={t('action.delete')}
          tooltipContent={t('action.delete')}
          onClick={deletePhoto}
        />
      </div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2">
        <IconButton
          active
          disabled={!prevPhoto}
          icon={<ChevronRightIcon className="rotate-180" />}
          aria-label={t('action.previous')}
          tooltipContent={t('action.previous')}
          onClick={() => goTo(-1)}
        ></IconButton>
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <IconButton
          active
          disabled={!nextPhoto}
          icon={<ChevronRightIcon />}
          aria-label={t('action.next')}
          tooltipContent={t('action.next')}
          onClick={() => goTo(1)}
        />
      </div>
    </div>
  );
}
