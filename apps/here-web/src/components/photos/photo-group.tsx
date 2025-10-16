import { useAtom, useAtomValue } from 'jotai';
import justifiedLayout from 'justified-layout';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';

import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

import PhotoUI from './photo';

import { photosLayoutAtom, selectedPhotoIdsAtom } from '~/atoms';
import { useLocaleDate } from '~/hooks/use-locale-date';
import { cn } from '~/lib/utils';
import { GalleryArrange, PhotoUIType, TimelineGroup } from '~/schemas';

interface PhotosGroupProps {
  albumId?: string;
  title?: string;
  photos: PhotoUIType[];
  viewportWidth: number;
}

type JustifiedLayoutItem = number | { width: number; height: number };

export default function PhotoGroup({
  title,
  albumId,
  photos,
  viewportWidth,
}: PhotosGroupProps) {
  const t = useTranslations();
  const { formatDate } = useLocaleDate();
  const photosLayout = useAtomValue(photosLayoutAtom);
  const [selectedPhotoIds, setSelectedPhotoIds] = useAtom(selectedPhotoIdsAtom);
  const isJustified = photosLayout.arrange === GalleryArrange.Justified;

  const isGroupSelected = useMemo(
    () => photos.every((photo) => selectedPhotoIds.has(photo.photoId)),
    [photos, selectedPhotoIds]
  );

  const arrange = useMemo(() => {
    if (!isJustified || photos.length === 0) return null;

    const thumbnails: JustifiedLayoutItem[] = photos.map((p) => p.ratio ?? 1);
    return justifiedLayout(thumbnails as JustifiedLayoutItem[], {
      containerPadding: 0,
      containerWidth: viewportWidth,
      boxSpacing: {
        vertical: photosLayout.spacing ?? 0,
        horizontal: photosLayout.spacing ?? 0,
      },
      targetRowHeight: photosLayout.size,
    });
  }, [
    photos,
    isJustified,
    viewportWidth,
    photosLayout.size,
    photosLayout.spacing,
  ]);

  const onGroupSelectChange = useCallback(
    (selected: boolean) => {
      setSelectedPhotoIds((prev) => {
        const next = new Set(prev);
        photos.forEach((photo) => {
          if (selected) {
            next.add(photo.photoId);
          } else {
            next.delete(photo.photoId);
          }
        });
        return next;
      });
    },
    [photos, setSelectedPhotoIds]
  );

  /** Memoize style objects */
  const gridStyle = useMemo(
    () => ({
      gap: photosLayout.spacing,
      gridTemplateColumns: `repeat(auto-fill, minmax(min(14rem, 100%), 1fr))`,
    }),
    [photosLayout.spacing]
  );

  return (
    <section>
      {(title || selectedPhotoIds.size > 0) && (
        <header className="flex group items-center gap-x-3 h-12 px-4 text-sm font-medium">
          <Checkbox
            checked={isGroupSelected}
            onCheckedChange={onGroupSelectChange}
            className={cn(
              'rounded-full',
              !isGroupSelected && 'sm:hidden sm:group-hover:block'
            )}
          />
          <Label>
            {title && photosLayout.timeline !== TimelineGroup.None
              ? formatDate(title)
              : t('photos.allPhotos')}
            {isGroupSelected && (
              <span className="text-secondary ml-2">
                {t('photos.numSelected', { count: photos.length })}
              </span>
            )}
          </Label>
        </header>
      )}

      {isJustified && arrange ? (
        <div
          className="relative overflow-hidden"
          style={{ height: arrange.containerHeight }}
        >
          {arrange.boxes.map(({ width, height, top, left }, i) => (
            <PhotoUI
              key={photos[i].photoId}
              albumId={albumId}
              photo={photos[i]}
              position={{ width, height, top, left }}
            />
          ))}
        </div>
      ) : (
        <div className="grid" style={gridStyle}>
          {photos.map((photo) => (
            <PhotoUI key={photo.photoId} photo={photo} />
          ))}
        </div>
      )}
    </section>
  );
}
