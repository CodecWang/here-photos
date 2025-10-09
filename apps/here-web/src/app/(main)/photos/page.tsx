'use client';

import clsx from 'clsx';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useLocale, useTranslations } from 'next-intl';
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
import FilterAltIcon from '~/icons/filter-alt-icon';
import TuneIcon from '~/icons/tune-icon';
import { request } from '~/utils/request';

import { groupPhotosByDate } from './utils';

import type { PhotoUIType } from '~/schemas';

export default function Page() {
  const t = useTranslations();
  const locale = useLocale();
  const [photos, setPhotos] = useAtom(photosAtom);
  const photosLayout = useAtomValue(photosLayoutAtom);
  const setSelectedPhotoIds = useSetAtom(selectedPhotoIdsAtom);

  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState<string>();
  const [isOpenLayout, setIsOpenLayout] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    const rawPhotos = await request<PhotoUIType[]>('/api/v1/photos');
    if (rawPhotos) {
      setPhotos(rawPhotos);
      setSelectedPhotoIds(new Set());
    }
    setLoading(false);
  }, [setPhotos]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    if (!photos.length) return;

    console.log('>>> photosLayout', photosLayout);

    const filteredPhotos = photos.filter((photo) => {
      if (!keyword) return true;
      return photo.tags?.includes(keyword);
    });

    const groups = groupPhotosByDate(
      filteredPhotos,
      photosLayout.timeline,
      locale
    );
    console.log('>>> regrouped photos', groups);
    setPhotoGroups(groups);
  }, [photos, photosLayout.timeline, keyword, locale]);

  const onOpenLayoutSetting = () => {
    setIsOpenFilter(false);
    setIsOpenLayout((prev) => !prev);
  };

  const onOpenFilter = () => {
    setIsOpenLayout(false);
    setIsOpenFilter((prev) => !prev);
  };

  // TODO(arthur): Add empty state

  return (
    <>
      <div
        className={clsx(
          'absolute inset-0 overflow-x-hidden overflow-y-auto transition-all duration-500',
          (isOpenLayout || isOpenFilter) && 'sm:right-80'
        )}
        ref={scrollRef}
      >
        <PageHeader title={t('nav.photos')} scrollContainer={scrollRef}>
          {photoGroups.length > 0 && (
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

          <div className="whitespace-nowrap flex items-center space-x-1 ar-wrap">
            <Upload />

            <IconButton
              active={isOpenLayout}
              icon={<TuneIcon />}
              aria-label={t('photos.layoutTip')}
              disabled={!photoGroups.length}
              tooltipContent={t('photos.layoutTip')}
              onClick={onOpenLayoutSetting}
            />
            <IconButton
              active={isOpenFilter}
              icon={<FilterAltIcon />}
              aria-label={t('photos.filterTip')}
              disabled={!photoGroups.length}
              tooltipContent={t('photos.filterTip')}
              onClick={onOpenFilter}
            />
          </div>

          <PhotoActions onDelete={() => fetchPhotos()} />
        </PageHeader>

        <div className="pt-2">
          {loading ? <Spinner /> : <Photos data={photoGroups} />}
          {!loading && photoGroups.length === 0 && (
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
        open={isOpenLayout}
        onClose={() => setIsOpenLayout(false)}
      />

      <PhotosFilter
        open={isOpenFilter}
        onChange={() => {
          // do nothing
        }}
        onClose={() => setIsOpenFilter(false)}
      />
    </>
  );
}
