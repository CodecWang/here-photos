'use client';

import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

import { photosAtom, photosLayoutAtom } from '~/atoms';
import { IconButton } from '~/components/icon-button';
import PageHeader from '~/components/page-header';
import Photos from '~/components/photos';
import PhotoActions from '~/components/photos/photo-actions';
import PhotosFilter from '~/components/photos/photos-filter';
import PhotosLayout from '~/components/photos/photos-layout-setting';
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

  const [keyword, setKeyword] = useState<string>();
  const [isOpenLayout, setIsOpenLayout] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchPhotos = useCallback(async () => {
    const rawPhotos = await request<PhotoUIType[]>('/api/v1/photos');
    if (rawPhotos && rawPhotos.length > 0) {
      setPhotos(rawPhotos);
    }
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
          <ToggleGroup
            type="single"
            className="m-auto"
            onValueChange={setKeyword}
            value={keyword}
          >
            <ToggleGroupItem value="旅行" className="rounded-full">
              旅行
            </ToggleGroupItem>
            <ToggleGroupItem value="摄影" className="rounded-full">
              摄影
            </ToggleGroupItem>
            <ToggleGroupItem value="宠物" className="rounded-full">
              宠物
            </ToggleGroupItem>
            <ToggleGroupItem value="家庭" className="rounded-full">
              家庭
            </ToggleGroupItem>
            <ToggleGroupItem value="美食" className="rounded-full">
              美食
            </ToggleGroupItem>
          </ToggleGroup>
          {/* </div> */}

          <div className="whitespace-nowrap flex items-center space-x-1 bg-background border rounded-full p-1">
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

          <PhotoActions
            onDelete={() => fetchPhotos()}
            onAddToAlbum={() => fetchPhotos()}
          />
        </PageHeader>

        <div className="pt-2">
          <Photos data={photoGroups} />
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
