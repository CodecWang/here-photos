import { PhotoGroupDTO, PhotoReadQueryDTO } from '@here-photos/dto';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';

import { photosAtom, photosLayoutAtom, selectedPhotoIdsAtom } from '~/atoms';
import { REQUEST_DEBOUNCE_MS } from '~/config/constants';
import { makeParams } from '~/utils/params';
import { request } from '~/utils/request';

export function usePhotoGroups({ albumId }: { albumId?: string } = {}) {
  const photosLayout = useAtomValue(photosLayoutAtom);
  const setSelectedPhotoIds = useSetAtom(selectedPhotoIdsAtom);

  const setPhotos = useSetAtom(photosAtom);

  const [photoGroups, setPhotoGroups] = useState<PhotoGroupDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchPhotos = useCallback(
    async (query?: PhotoReadQueryDTO) => {
      if (loading) return;

      console.log('>>> re-grouping photos', photosLayout);
      setLoading(true);
      const params = makeParams(query);
      const url = albumId
        ? `/api/v1/albums/${albumId}/photos?${params}`
        : `/api/v1/photos?${params}`;
      const groups = await request<PhotoGroupDTO[]>(url);
      setPhotoGroups(groups ?? []);
      setPhotos(groups?.flatMap((g) => g.photos) ?? []);
      setSelectedPhotoIds(new Set());
      setLoading(false);
      // setHasLoaded(true);
    },
    [loading]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPhotos({
        timeline: photosLayout.timeline,
        orderBy: photosLayout.orderBy,
        order: photosLayout.sortOrder,
      });
    }, REQUEST_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [photosLayout.timeline, photosLayout.orderBy, photosLayout.sortOrder]);

  return { photoGroups, loading };
}
