import React from 'react';

import PhotoViewer from '~/components/photos/photo-viewer';

interface PageProps {
  params: Promise<{ albumId: string; photoId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { albumId, photoId } = await params;
  return <PhotoViewer albumId={albumId} photoId={photoId} />;
}
