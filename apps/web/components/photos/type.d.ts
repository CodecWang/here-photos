interface PhotosGroupProps {
  title?: string;
  photos: Photo[];
  layout: PhotosLayout;
  viewportWidth: number;
}

interface PhotosProps {
  data: PhotosGroup[];
  layout: PhotosLayout;
}
