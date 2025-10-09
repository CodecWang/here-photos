import React from 'react';

import PhotoViewer from '~/components/photos/photo-viewer';

interface PageProps {
  params: Promise<{ photoId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { photoId } = await params;
  return <PhotoViewer photoId={photoId} />;
}
