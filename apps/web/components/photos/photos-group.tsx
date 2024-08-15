import justifiedLayout from 'justified-layout';
import Image from 'next/image';

import { GalleryLayout } from '@/types/enums';

import Photo from '../photo';

export default function PhotosGroup(props: PhotosGroupProps) {
  const { title, photos, layout, viewportWidth } = props;

  const arrange = justifiedLayout(
    photos.map((photo) => photo.thumbnails[0]),
    {
      containerWidth: viewportWidth,
      containerPadding: 0,
      boxSpacing: {
        horizontal: layout.spacing,
        vertical: layout.spacing,
      },
      targetRowHeight: layout.size,
      // targetRowHeightTolerance: 0,
      // forceAspectRatio: 1,
      // fullWidthBreakoutRowCadence: 2
    },
  );

  console.log('>>>>', arrange);

  return (
    <div className=".item">
      {title && (
        <div className="flex h-12 items-center text-sm">
          <span>{title}</span>
        </div>
      )}

      {layout.layout === GalleryLayout.Justified && (
        <div
          className="relative overflow-hidden"
          style={{ height: arrange.containerHeight }}
        >
          {arrange.boxes.map(({ width, height, top, left }, index) => (
            <Photo
              photo={photos[index]}
              key={photos[index].id}
              width={width}
              height={height}
              top={top}
              left={left}
              // onClick={onClick}
              // onSelect={onSelect}
            />
          ))}
        </div>
      )}

      {(layout.layout === GalleryLayout.Grid ||
        layout.layout === GalleryLayout.Grid1x1) && (
        <div className="grid grid-cols-4" style={{ gap: layout.spacing }}>
          {photos.map((photo) => (
            <div
              key={photo.id}
              style={{ width: viewportWidth / 4, height: viewportWidth / 4 }}
            >
              <Image
                style={{
                  width: viewportWidth / 4,
                  height: viewportWidth / 4,
                  objectFit:
                    layout.layout === GalleryLayout.Grid1x1
                      ? 'cover'
                      : 'contain',
                }}
                src={`/api/v1/photos/${photo.id}/thumbnail?variant=2`}
                width={viewportWidth / 4}
                height={viewportWidth / 4}
                alt=""
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
