'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

import PageHeader from '@/components/page-header';
import Photos from '@/components/photos';
import PhotosLayoutSetting from '@/components/photos/photos-layout-setting';
import IconButton from '@/components/ui/icon-button';
import Upload from '@/components/upload';
import { DEFAULT_PHOTOS_LAYOUT } from '@/config/constants';
import { NavMode } from '@/config/enums';
import FilterAltIcon from '@/icons/filter-alt-icon';
import SelfImprovementIcon from '@/icons/self-improvement-icon';
import TuneIcon from '@/icons/tune-icon';
import { request } from '@/utils/request';

import { useNavMode } from '../nav-provider';
import { groupPhotosByDate } from './utils';

export default function Page() {
  const { navMode, setNavMode } = useNavMode();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);
  const [openLayoutSetting, setOpenLayoutSetting] = useState(false);
  const [layout, setLayout] = useState<PhotosLayout>(DEFAULT_PHOTOS_LAYOUT);

  useEffect(() => {
    (async () => {
      const rawPhotos = await request('/api/v1/photos');
      rawPhotos && setPhotos(rawPhotos.data);
    })();
  }, []);

  useEffect(() => {
    if (!photos.length) return;

    console.log('>>> regrouping photos');

    const groups = groupPhotosByDate(photos, layout.groupBy);
    setPhotoGroups(groups);
  }, [photos, layout.groupBy]);

  return (
    <>
      <div
        className={clsx(
          'absolute inset-0 overflow-y-auto overflow-x-hidden transition-all duration-500',
          openLayoutSetting && 'sm:right-80',
        )}
      >
        <PageHeader title="Photos">
          {navMode === NavMode.Modern && <Upload />}
          <IconButton
            active={openLayoutSetting}
            disabled={!photoGroups.length}
            tooltip="Layout setting"
            onClick={() => setOpenLayoutSetting((prev) => !prev)}
            icon={<TuneIcon className="size-5" />}
          />
          <IconButton
            tooltip="Zen mode"
            disabled={!photoGroups.length}
            onClick={() => setNavMode(NavMode.Traditional)}
            icon={<SelfImprovementIcon className="size-5" />}
          />
          <IconButton
            tooltip="Filter"
            disabled={!photoGroups.length}
            onClick={() => setNavMode(NavMode.Traditional)}
            icon={<FilterAltIcon className="size-5" />}
          />
        </PageHeader>

        <div className="px-0 pt-2 sm:px-4">
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
