import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';

import { photosLayoutAtom, selectedPhotoIdsAtom } from '~/atoms';
import { GalleryArrange } from '~/schemas';

import PhotoGroup from './photo-group';

interface PhotosProps {
  data: PhotoGroupType[];
}

export default function Photos({ data }: PhotosProps) {
  const photosLayout = useAtomValue(photosLayoutAtom);
  const setSelectedPhotoIds = useSetAtom(selectedPhotoIdsAtom);

  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const isJustified = photosLayout.arrange === GalleryArrange.Justified;

  const handleResize = useCallback(([entry]: ResizeObserverEntry[]) => {
    if (!entry) return;

    const newWidth = entry.contentRect.width;
    setViewportWidth((prevWidth) =>
      prevWidth !== newWidth ? newWidth : prevWidth
    );
  }, []);

  useEffect(() => {
    const currentViewportRef = viewportRef.current;
    if (!currentViewportRef || !isJustified) {
      return;
    }

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(currentViewportRef);

    return () => {
      resizeObserver.unobserve(currentViewportRef);
      resizeObserver.disconnect();
    };
  }, [isJustified, handleResize]);

  useEffect(() => {
    return () => {
      setSelectedPhotoIds(new Set());
    };
  }, []);

  if (isJustified && !viewportWidth) {
    return <div ref={viewportRef} />;
  }

  return (
    <div ref={viewportRef}>
      {data.map(({ title, photos }) => (
        <PhotoGroup
          key={title}
          title={title}
          photos={photos}
          viewportWidth={viewportWidth}
        />
      ))}
    </div>
  );
}
