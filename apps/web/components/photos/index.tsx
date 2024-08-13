import { useEffect, useRef, useState } from "react";
import PhotosGroup from "./photos-group";
import { FixedSizeList as List } from "react-window";

export default function Photos({ data, layout }: PhotosProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const currentViewportRef = viewportRef.current;
    if (!currentViewportRef) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      entries.forEach((entry) => setViewportWidth(entry.contentRect.width));
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(currentViewportRef);
    return () => resizeObserver.unobserve(currentViewportRef);
  }, []);

  if (!viewportWidth || !data.length) {
    return <div ref={viewportRef}></div>;
  }

  // TODO(arthur): 只加载视图内的PhotosGroup，这样只会计算视图内的布局
  return (
    <div ref={viewportRef}>
      {data.map(({ title, photos }, index) => (
        <PhotosGroup
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
