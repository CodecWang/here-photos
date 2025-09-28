import { thumbHashToDataURL } from '@here-photos/thumb-hash';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import Image, { ImageLoaderProps } from 'next/image';
import { useMemo } from 'react';

import { GalleryLayout } from '~/config/enums';

import { usePhotos } from './context';
import { useSetAtom } from 'jotai';
import { photosAtom } from '~/atoms';
import clsx from 'clsx';

interface PhotoProps {
  photo: Photo;
  layout: GalleryLayout;
  roundedCorner?: number;
  position?: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
}

export default function Photo({
  photo,
  layout,
  position,
  roundedCorner = 0,
}: PhotoProps) {
  const { setCurrentPhoto } = usePhotos();
  const setPhotos = useSetAtom(photosAtom);

  const blurDataURL = useMemo(() => {
    return thumbHashToDataURL(Buffer.from(photo.blurHash, 'base64'));
  }, [photo.blurHash]);

  const setPhoto = () => {
    setCurrentPhoto(photo);
  };

  const roundedCorners = [
    '0px',
    '4px',
    '8px',
    '16px',
    '24px',
    '32px',
    '48px',
    '999px',
  ];
  const roundedCornerValue = roundedCorners[roundedCorner / 10];

  const imageProps = {
    loader: ({ src }: ImageLoaderProps) => src,
    src: `/api/v1/photos/${photo.id}/thumbnail?variant=2`,
    fill: true,
    // sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    placeholder: 'blur' as PlaceholderValue,
    blurDataURL,
  };

  if (layout === GalleryLayout.Justified && position) {
    const { width, height, top, left } = position;
    return (
      <div
        className="absolute cursor-pointer overflow-hidden group bg-base-300"
        style={{ top, left, width, height }}
        onClick={setPhoto}
      >
        <Image
          {...imageProps}
          alt={photo.title}
          className="cursor-pointer transition-normal duration-500 hover:shadow-2xl"
          style={{
            borderRadius: roundedCornerValue,
            padding: photo.selected ? 20 : 0,
            objectFit: 'contain',
          }}
        />
        <div
          className={clsx(
            'absolute top-0 left-0 right-0 p-2',
            photo.selected
              ? 'flex'
              : 'bg-gradient-to-b from-black/70 to-transparent hidden group-hover:flex'
          )}
        >
          <input
            type="checkbox"
            checked={photo.selected}
            className="checkbox rounded-full ml-auto"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              if (e.target.checked) {
                setPhotos((prev) =>
                  prev.map((p) =>
                    p.id === photo.id ? { ...p, selected: true } : p
                  )
                );
              } else {
                console.log('deselected');
                setPhotos((prev) =>
                  prev.map((p) =>
                    p.id === photo.id ? { ...p, selected: false } : p
                  )
                );
              }
            }}
          />
        </div>
      </div>
    );
  }

  if (layout === GalleryLayout.Grid || layout === GalleryLayout.Grid1x1) {
    const className =
      layout === GalleryLayout.Grid
        ? 'object-scale-down transition-all duration-500'
        : 'object-cover transition-all duration-500';

    return (
      <div
        className="group relative aspect-square cursor-pointer hover:shadow-lg"
        onClick={setPhoto}
      >
        <Image
          {...imageProps}
          className={className}
          alt={photo.title}
          style={{
            borderRadius:
              layout === GalleryLayout.Grid ? 0 : roundedCornerValue,
          }}
        />
      </div>
    );
  }

  return null;
}
