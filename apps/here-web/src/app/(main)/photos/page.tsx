'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import KeywordFilter from '~/components/keyword-filter';
import PageHeader from '~/components/page-header';
import Photos from '~/components/photos';
import PhotosFilter from '~/components/photos/photos-filter';
import PhotosLayoutSetting from '~/components/photos/photos-layout-setting';
import IconButton from '~/components/ui/icon-button';
import Upload from '~/components/upload';
import { DEFAULT_PHOTOS_LAYOUT } from '~/config/constants';
import { NavMode } from '~/config/enums';
import FilterAltIcon from '~/icons/filter-alt-icon';
import TuneIcon from '~/icons/tune-icon';
import { request } from '~/utils/request';

import { useNavMode } from '../nav-provider';
import { groupPhotosByDate } from './utils';

export default function Page() {
  const t = useTranslations();
  const { navMode } = useNavMode();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);
  const [openLayoutSetting, setOpenLayoutSetting] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [layout, setLayout] = useState<PhotosLayout>(DEFAULT_PHOTOS_LAYOUT);
  const [keyword, setKeyword] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const rawPhotos = await request('/api/v1/photos');
      rawPhotos && setPhotos(rawPhotos.data);
    })();
  }, []);

  useEffect(() => {
    if (!photos.length) return;

    const filteredPhotos = photos.filter((photo) => {
      if (!keyword) return true;
      return photo.tags?.includes(keyword);
    });

    const groups = groupPhotosByDate(filteredPhotos, layout.groupBy);
    setPhotoGroups(groups);
  }, [photos, layout.groupBy, keyword]);

  return (
    <>
      <div
        className={clsx(
          'absolute inset-0 overflow-x-hidden overflow-y-auto transition-all duration-500',
          (openLayoutSetting || openFilter) && 'sm:right-80'
        )}
        ref={scrollRef}
      >
        <PageHeader title={t('nav.photos')} scrollContainer={scrollRef}>
          <div className="rounded-full ar-glass p-1 m-auto border shadow">
            <KeywordFilter
              className="m-auto hidden max-w-[326px] overflow-x-auto whitespace-nowrap filter sm:block md:max-w-[598px]"
              keywords={['旅行', '摄影', '家庭', '宠物', '美食']}
              selectedKeyword={keyword}
              onKeywordChange={setKeyword}
            />
          </div>

          <div className="whitespace-nowrap rounded-full ar-glass p-1 border shadow">
            {navMode === NavMode.Modern && <Upload />}
            <IconButton
              active={openLayoutSetting}
              disabled={!photoGroups.length}
              tooltip={t('photos.layoutTip')}
              onClick={() => {
                setOpenFilter(false);
                setOpenLayoutSetting((prev) => !prev);
              }}
              icon={<TuneIcon className="size-5" />}
            />
            <IconButton
              tooltip={t('photos.filterTip')}
              disabled={!photoGroups.length}
              // onClick={() => setNavMode(NavMode.Classic)}
              onClick={() => {
                setOpenLayoutSetting(false);
                setOpenFilter((prev) => !prev);
              }}
              icon={<FilterAltIcon className="size-5" />}
            />
          </div>
        </PageHeader>

        <div
          className="px-0 pt-2"
          style={{
            animation: 'button-pop var(--animation-btn, 0.25s) ease-out',
          }}
        >
          <Photos data={photoGroups} layout={layout} />
        </div>
      </div>

      <PhotosLayoutSetting
        open={openLayoutSetting}
        onChange={setLayout}
        onClose={() => setOpenLayoutSetting(false)}
      />

      <PhotosFilter
        open={openFilter}
        onChange={setLayout}
        onClose={() => setOpenFilter(false)}
      />
    </>
  );
}
