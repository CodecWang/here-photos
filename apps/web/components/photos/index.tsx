import { useCallback, useEffect, useRef, useState } from 'react';

import { GalleryLayout } from '@/types/enums';

import PhotoGroup from './photo-group';

export default function Photos({ data, layout }: PhotosProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    entries.forEach((entry) => {
      const newWidth = entry.contentRect.width;
      setViewportWidth((prevWidth) => {
        if (prevWidth !== newWidth) {
          console.log('>>> resizing', entries);
          return newWidth;
        }
        return prevWidth;
      });
    });
  }, []);

  useEffect(() => {
    const currentViewportRef = viewportRef.current;
    if (!currentViewportRef || layout.layout !== GalleryLayout.Justified)
      return;

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(currentViewportRef);

    return () => {
      resizeObserver.unobserve(currentViewportRef);
      resizeObserver.disconnect();
    };
  }, [layout.layout, handleResize]);

  return (
    <div ref={viewportRef}>
      {layout.layout === GalleryLayout.Justified && !viewportWidth
        ? null
        : data.map(({ title, photos }, index) => (
            <PhotoGroup
              key={index}
              title={title}
              photos={photos}
              layout={layout}
              viewportWidth={viewportWidth}
            />
          ))}
    </div>
  );
}
