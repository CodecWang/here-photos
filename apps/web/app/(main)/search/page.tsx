'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import Photos from '@/components/photos';
import { DEFAULT_PHOTOS_LAYOUT } from '@/config/constants';
import { request } from '@/utils/request';

export default function Search() {
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const [layout] = useState<PhotosLayout>(DEFAULT_PHOTOS_LAYOUT);
  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);

  const query = params.get('q');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const photos = await request(`/api/v1/photos/search?q=${query}`);
      if (photos) {
        setPhotoGroups([
          {
            title: 'Search results',
            photos: photos.data,
          },
        ]);
      }
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    })();
  }, [query]);

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 transition-all duration-500">
      {loading ? (
        <span className="loading loading-ring loading-lg"></span>
      ) : (
        <Photos data={photoGroups} layout={{ ...layout, size: 220 }} />
      )}
    </div>
  );
}
