'use client';

import { PhotoGroupDTO, PhotoReadQueryDTO } from '@here-photos/dto';
import clsx from 'clsx';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

import { photosAtom, photosLayoutAtom, selectedPhotoIdsAtom } from '~/atoms';
import EmptyUI from '~/components/empty-ui';
import { IconButton } from '~/components/icon-button';
import PageHeader from '~/components/page-header';
import Photos from '~/components/photos';
import PhotoActions from '~/components/photos/photo-actions';
import PhotosFilter from '~/components/photos/photos-filter';
import PhotosLayout from '~/components/photos/photos-layout-setting';
import { Button } from '~/components/ui/button';
import { Spinner } from '~/components/ui/spinner';
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group';
import Upload from '~/components/upload';
import { REQUEST_DEBOUNCE_MS } from '~/config/constants';
import FilterAltIcon from '~/icons/filter-alt-icon';
import TuneIcon from '~/icons/tune-icon';
import { request } from '~/utils/request';

type PanelType = 'layout' | 'filter' | null;

export default function Page() {
  const t = useTranslations();
  const setPhotos = useSetAtom(photosAtom);
  const photosLayout = useAtomValue(photosLayoutAtom);
  const [selectedPhotoIds, setSelectedPhotoIds] = useAtom(selectedPhotoIdsAtom);

  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [keyword, setKeyword] = useState<string>();
  const [openPanel, setOpenPanel] = useState<PanelType>(null);
  const [photoGroups, setPhotoGroups] = useState<PhotoGroupDTO[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchPhotos = useCallback(
    async (query?: PhotoReadQueryDTO) => {
      if (loading) return;

      console.log('>>> re-grouping photos', photosLayout);
      setLoading(true);
      const params = new URLSearchParams(query);
      const groups = await request<PhotoGroupDTO[]>(`/api/v1/photos?${params}`);
      setPhotoGroups(groups ?? []);
      setPhotos(groups?.flatMap((g) => g.photos) ?? []);
      setSelectedPhotoIds(new Set());
      setLoading(false);
      setHasLoaded(true);
    },
    [loading]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPhotos({
        timeline: photosLayout.timeline,
        orderBy: 'birthTime',
        order: 'desc',
      });
    }, REQUEST_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [photosLayout.timeline]);

  const togglePanel = (panel: PanelType) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  return (
    <>
      <div
        className={clsx(
          'absolute inset-0 overflow-x-hidden overflow-y-auto transition-all duration-500',
          openPanel !== null && 'sm:right-80'
        )}
        ref={scrollRef}
      >
        <PageHeader title={t('nav.photos')} scrollContainer={scrollRef}>
          {photoGroups.length > 0 && selectedPhotoIds.size === 0 && (
            <ToggleGroup
              type="single"
              className="m-auto ar-wrap"
              onValueChange={setKeyword}
              value={keyword}
            >
              <ToggleGroupItem value="旅行" className="rounded-full">
                Travel
              </ToggleGroupItem>
              <ToggleGroupItem value="摄影" className="rounded-full">
                Photography
              </ToggleGroupItem>
              <ToggleGroupItem value="宠物" className="rounded-full">
                Pets
              </ToggleGroupItem>
              <ToggleGroupItem value="家庭" className="rounded-full">
                Family
              </ToggleGroupItem>
              <ToggleGroupItem value="美食" className="rounded-full">
                Food
              </ToggleGroupItem>
            </ToggleGroup>
          )}

          {selectedPhotoIds.size === 0 && (
            <div className="whitespace-nowrap flex items-center space-x-1 ar-wrap">
              <Upload disabled={loading} />

              <IconButton
                active={openPanel === 'layout'}
                icon={<TuneIcon />}
                aria-label={t('photos.layoutTip')}
                disabled={!photoGroups.length}
                tooltipContent={t('photos.layoutTip')}
                onClick={() => togglePanel('layout')}
              />
              <IconButton
                active={openPanel === 'filter'}
                icon={<FilterAltIcon />}
                aria-label={t('photos.filterTip')}
                disabled={!photoGroups.length}
                tooltipContent={t('photos.filterTip')}
                onClick={() => togglePanel('filter')}
              />
            </div>
          )}

          {selectedPhotoIds.size > 0 && (
            <PhotoActions onDelete={() => fetchPhotos()} />
          )}
        </PageHeader>

        <div className="pt-2">
          {!hasLoaded && <Spinner />}
          {hasLoaded && loading && <Spinner />}
          {hasLoaded && !loading && photoGroups.length > 0 && (
            <Photos data={photoGroups} />
          )}
          {hasLoaded && !loading && photoGroups.length === 0 && (
            <EmptyUI
              title="No Photos Yet"
              description="You haven't created any photos yet. Get started by adding or uploading your first photo."
              actions={
                <>
                  <Button>Scan</Button>
                  <Button variant="outline">Upload</Button>
                </>
              }
            />
          )}
        </div>
      </div>

      <PhotosLayout
        open={openPanel === 'layout'}
        onClose={() => setOpenPanel(null)}
      />

      <PhotosFilter
        open={openPanel === 'filter'}
        onChange={() => {
          // do nothing
        }}
        onClose={() => setOpenPanel(null)}
      />
    </>
  );
}
