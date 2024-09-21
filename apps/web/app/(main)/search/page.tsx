'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import Photos from '@/components/photos';
import { DEFAULT_PHOTOS_LAYOUT } from '@/config/constants';

export default function Search() {
  const params = useSearchParams();
  const [layout] = useState<PhotosLayout>(DEFAULT_PHOTOS_LAYOUT);

  const query = params.get('q');

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 transition-all duration-500">
      {query}

      <Photos data={[]} layout={layout} />
    </div>
  );
}
