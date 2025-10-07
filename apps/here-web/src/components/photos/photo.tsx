import { thumbHashToDataURL } from '@here-photos/thumb-hash';
import { useAtom, useAtomValue } from 'jotai';
import Image from 'next/image';
import { useCallback, useMemo } from 'react';

import { photosLayoutAtom, selectedPhotoIdsAtom } from '~/atoms';
import { ROUNDED_CORNERS } from '~/config/constants';
import { cn } from '~/lib/utils';
import { GalleryArrange, PhotoUIType } from '~/schemas';

import { Checkbox } from '../ui/checkbox';

import type { Photo } from '@here-photos/db';
import type { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';

interface PhotoProps {
  photo: PhotoUIType;
  position?: { width: number; height: number; top: number; left: number };
}

export default function Photo({ photo, position }: PhotoProps) {
  const { arrange, roundedCorner } = useAtomValue(photosLayoutAtom);
  const [selectedPhotoIds, setSelectedPhotoIds] = useAtom(selectedPhotoIdsAtom);

  const isSelected = selectedPhotoIds.has(photo.photoId);
  const roundedCornerValue = ROUNDED_CORNERS[roundedCorner / 10];

  const blurDataURL = useMemo(() => {
    if (!photo.blurHash) return undefined;
    return thumbHashToDataURL(Buffer.from(photo.blurHash, 'base64'));
  }, [photo.blurHash]);

  // TODO(arthur): handle different scale thumbnail sizes
  const imageLoader = useCallback(
    ({ width }: { width: number }) =>
      `/api/v1/photos/${photo.photoId}/thumbnails?type=md${
        width ? `&w=${width}` : ''
      }`,
    [photo.photoId]
  );

  const commonImageProps = {
    loader: imageLoader,
    src: `/api/v1/photos/${photo.photoId}/thumbnails?type=md`,
    alt: photo.photoId,
    fill: true,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    placeholder: 'blur' as PlaceholderValue,
    blurDataURL,
  };

  const onPhotoSelectedChange = useCallback(
    (selected: boolean) => {
      setSelectedPhotoIds((prev) => {
        const next = new Set(prev);
        if (selected) {
          next.add(photo.photoId);
        } else {
          next.delete(photo.photoId);
        }
        return next;
      });
    },
    [photo.photoId, setSelectedPhotoIds]
  );

  const onPhotoClick = useCallback(() => {
    // setCurrentPhoto(photo);
  }, [photo]);

  if (arrange === GalleryArrange.Justified && position) {
    const { width, height, top, left } = position;
    return (
      <div
        className="absolute cursor-pointer overflow-hidden group"
        style={{ top, left, width, height }}
        onClick={onPhotoClick}
      >
        <Image
          {...commonImageProps}
          alt={photo.photoId}
          className="cursor-pointer transition-normal duration-500 hover:shadow-2xl"
          style={{
            borderRadius: roundedCornerValue,
            padding: isSelected ? 20 : 0,
            objectFit: 'contain',
          }}
        />
        <div
          className={cn(
            'absolute top-0 left-0 right-0 p-2',
            isSelected
              ? 'flex'
              : 'bg-gradient-to-b from-background/40 to-transparent hidden group-hover:flex'
          )}
        >
          <Checkbox
            checked={isSelected}
            className="rounded-full ml-auto"
            onCheckedChange={onPhotoSelectedChange}
          />
        </div>
      </div>
    );
  }

  if (arrange === GalleryArrange.Grid || arrange === GalleryArrange.Grid1x1) {
    const className =
      arrange === GalleryArrange.Grid
        ? 'object-scale-down transition-all duration-500'
        : 'object-cover transition-all duration-500';

    return (
      <div
        className="group relative aspect-square cursor-pointer hover:shadow-lg"
        onClick={onPhotoClick}
      >
        <Image
          {...commonImageProps}
          className={className}
          alt={photo.photoId}
          style={{
            borderRadius:
              arrange === GalleryArrange.Grid ? 0 : roundedCornerValue,
          }}
        />
      </div>
    );
  }

  return null;
}
