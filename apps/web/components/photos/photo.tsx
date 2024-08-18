import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { useMemo } from 'react';

import { GalleryLayout } from '@/types/enums';
import { thumbHashToDataURL } from '@/utils/thumb-hash';

interface PhotoProps {
  photo: Photo;
  layout: GalleryLayout;
  position?: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
}

export default function Photo({ photo, layout, position }: PhotoProps) {
  const blurDataURL = useMemo(() => {
    return thumbHashToDataURL(Buffer.from(photo.blurHash, 'base64'));
  }, [photo.blurHash]);

  const imageProps = {
    src: `/api/v1/photos/${photo.id}/thumbnail?variant=2`,
    fill: true,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    alt: '',
    placeholder: 'blur' as PlaceholderValue,
    blurDataURL,
  };

  if (layout === GalleryLayout.Justified && position) {
    const { width, height, top, left } = position;
    return (
      <div className="absolute" style={{ top, left, width, height }}>
        <Image {...imageProps} />
      </div>
    );
  }

  if (layout === GalleryLayout.Grid || layout === GalleryLayout.Grid1x1) {
    return (
      <div className="hover:border-base-content relative aspect-square cursor-pointer overflow-hidden hover:border">
        <Image {...imageProps} />
      </div>
    );
  }

  return null;
}
