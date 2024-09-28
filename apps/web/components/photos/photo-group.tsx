import justifiedLayout from 'justified-layout';
import { useMemo } from 'react';

import { GalleryLayout } from '~/config/enums';

import Photo from './photo';

interface PhotosGroupProps {
  title?: string;
  photos: Photo[];
  layout: PhotosLayout;
  viewportWidth: number;
}

export default function PhotoGroup({
  title,
  photos,
  layout,
  viewportWidth,
}: PhotosGroupProps) {
  const arrange = useMemo(() => {
    if (layout.layout !== GalleryLayout.Justified) return;

    console.log('>>> re-calculating layout');

    return justifiedLayout(
      photos.map((photo) => photo.thumbnails[0]),
      {
        containerWidth: viewportWidth,
        containerPadding: 0,
        boxSpacing: {
          horizontal: layout.spacing ?? 0,
          vertical: layout.spacing ?? 0,
        },
        targetRowHeight: layout.size,
      },
    );
  }, [photos, layout.spacing, layout.layout, layout.size, viewportWidth]);

  return (
    <div>
      {title && (
        <div className="group flex h-12 items-center px-4 text-sm font-medium sm:px-0">
          <input
            type="checkbox"
            className="checkbox checkbox-sm mr-2 rounded-full sm:hidden sm:group-hover:block"
          />
          <span>{title}</span>
        </div>
      )}

      {layout.layout === GalleryLayout.Justified ? (
        <div
          className="relative overflow-hidden"
          style={{ height: arrange?.containerHeight }}
        >
          {arrange?.boxes.map(({ width, height, top, left }, index) => (
            <Photo
              photo={photos[index]}
              key={photos[index].id}
              layout={layout.layout}
              position={{ width, height, top, left }}
            />
          ))}
        </div>
      ) : (
        <div
          className="grid grid-cols-[repeat(auto-fill,minmax(min(14rem,100%),1fr))]"
          style={{ gap: layout.spacing }}
        >
          {photos.map((photo) => (
            <Photo photo={photo} key={photo.id} layout={layout.layout} />
          ))}
        </div>
      )}
    </div>
  );
}
