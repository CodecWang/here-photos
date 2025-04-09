'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import PageHeader from '~/components/page-header';
import Photos from '~/components/photos';
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
  const { navMode, setNavMode } = useNavMode();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);
  const [openLayoutSetting, setOpenLayoutSetting] = useState(false);
  const [layout, setLayout] = useState<PhotosLayout>(DEFAULT_PHOTOS_LAYOUT);
  const [filters, setFilters] = useState('');

  useEffect(() => {
    (async () => {
      const rawPhotos = await request('/api/v1/photos');
      rawPhotos && setPhotos(rawPhotos.data);
    })();
  }, []);

  useEffect(() => {
    if (!photos.length) return;

    const filteredPhotos = photos.filter((photo) => {
      if (!filters) return true;
      return photo.tags?.includes(filters);
    });

    const groups = groupPhotosByDate(filteredPhotos, layout.groupBy);
    setPhotoGroups(groups);
  }, [photos, layout.groupBy, filters]);

  return (
    <>
      <div
        className={clsx(
          'absolute inset-0 overflow-x-hidden overflow-y-auto transition-all duration-500',
          openLayoutSetting && 'sm:right-80',
        )}
      >
        <PageHeader title={t('nav.photos')}>
          <form
            className="m-auto hidden max-w-[326px] overflow-x-auto whitespace-nowrap filter sm:block md:max-w-[598px]"
            onReset={() => setFilters('')}
          >
            <input className="btn btn-square" type="reset" value="×" />
            <input
              className="btn"
              type="radio"
              name="frameworks"
              aria-label="旅行"
              checked={filters === '旅行'}
              onChange={() => setFilters('旅行')}
            />
            <input
              className="btn"
              type="radio"
              name="frameworks"
              aria-label="摄影"
              checked={filters === '摄影'}
              onChange={() => setFilters('摄影')}
            />
            <input
              className="btn"
              type="radio"
              name="frameworks"
              aria-label="家庭"
              checked={filters === '家庭'}
              onChange={() => setFilters('家庭')}
            />
            <input
              className="btn"
              type="radio"
              name="frameworks"
              aria-label="宠物"
              checked={filters === '宠物'}
              onChange={() => setFilters('宠物')}
            />
          </form>

          <div className="whitespace-nowrap">
            {navMode === NavMode.Modern && <Upload />}
            <IconButton
              active={openLayoutSetting}
              disabled={!photoGroups.length}
              tooltip={t('photos.layoutTip')}
              onClick={() => setOpenLayoutSetting((prev) => !prev)}
              icon={<TuneIcon className="size-5" />}
            />
            {/* <IconButton
            tooltip="Zen mode"
            disabled={!photoGroups.length}
            onClick={() => setNavMode(NavMode.Traditional)}
            icon={<SelfImprovementIcon className="size-5" />}
          /> */}
            <IconButton
              tooltip={t('photos.filterTip')}
              disabled={!photoGroups.length}
              onClick={() => setNavMode(NavMode.Classic)}
              icon={<FilterAltIcon className="size-5" />}
            />
          </div>
        </PageHeader>

        <div
          className="px-0 pt-2 sm:px-4"
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
    </>
  );
}
