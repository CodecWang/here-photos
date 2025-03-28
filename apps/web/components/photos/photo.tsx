import { thumbHashToDataURL } from '@here-photos/thumb-hash';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import Image, { ImageLoaderProps } from 'next/image';
import { useMemo } from 'react';

import { GalleryLayout } from '~/config/enums';

import { usePhotos } from './context';

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

  const blurDataURL = useMemo(() => {
    return thumbHashToDataURL(Buffer.from(photo.blurHash, 'base64'));
  }, [photo.blurHash]);

  const setPhoto = () => {
    setCurrentPhoto(photo);
  };

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
        className="absolute cursor-pointer overflow-hidden"
        style={{ top, left, width, height }}
        onClick={setPhoto}
      >
        <Image
          {...imageProps}
          alt={photo.title}
          style={{ borderRadius: roundedCorner }}
        />
      </div>
    );
  }

  if (layout === GalleryLayout.Grid || layout === GalleryLayout.Grid1x1) {
    const className =
      layout === GalleryLayout.Grid ? 'object-scale-down' : 'object-cover';

    return (
      <div
        className="hover:border-base-content relative aspect-square cursor-pointer overflow-hidden rounded-[8px] hover:border"
        onClick={setPhoto}
      >
        <Image
          {...imageProps}
          className={className}
          alt={photo.title}
          style={{
            borderRadius: layout === GalleryLayout.Grid ? 0 : roundedCorner,
          }}
        />
      </div>
    );
  }

  return null;
}
