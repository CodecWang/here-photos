import { PropsWithChildren } from 'react';

interface PhotosLayoutProps extends PropsWithChildren {
  viewer?: React.ReactNode;
}

export default function PhotosLayout({ children, viewer }: PhotosLayoutProps) {
  return (
    <>
      {children}
      {viewer}
    </>
  );
}
