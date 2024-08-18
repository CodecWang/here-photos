'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useContext } from 'react';

import PageHeader from '@/components/page-header';
import Photos from '@/components/photos';
import PhotosLayoutSetting from '@/components/photos/photos-layout-setting';
import Upload from '@/components/upload';
import { DEFAULT_PHOTOS_LAYOUT } from '@/config/constants';
import FilterAltIcon from '@/icons/filter-alt-icon';
import SelfImprovementIcon from '@/icons/self-improvement-icon';
import TuneIcon from '@/icons/tune-icon';
import { NavMode } from '@/types/enums';
import { request } from '@/utils/request';

import { NavContext } from '../nav-provider';
import { groupPhotoByDate } from './utils';

export default function Page() {
  const { navMode, setNavMode } = useContext(NavContext);
  const [openLayoutSetting, setOpenLayoutSetting] = useState(false);
  const [photosLayout, setPhotosLayout] = useState<PhotosLayout>(
    DEFAULT_PHOTOS_LAYOUT,
  );
  const [photos, setPhotos] = useState<any[]>([]);
  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);

  useEffect(() => {
    (async () => {
      const rawPhotos = await request('/api/v1/photos');
      rawPhotos && setPhotos(rawPhotos.data);
    })();
    const sidebar = document.getElementById('sidebar');
    sidebar?.style.display === 'none';

    const value = localStorage.getItem('photos-layout');
    const cachedLayout = JSON.parse(value || '{}');
    setPhotosLayout((prev) => ({ ...prev, ...cachedLayout }));
  }, []);

  useEffect(() => {
    if (!photos.length) return;

    console.log('>>> regrouping photos');

    const photoGroups = groupPhotoByDate(photos, photosLayout.groupBy);
    setPhotoGroups(photoGroups);
  }, [photos, photosLayout.groupBy]);

  const handleLayoutChange = (newView: PhotosLayout) => {
    setPhotosLayout((prev) => {
      const newLayout = { ...prev, ...newView };
      localStorage.setItem('photos-layout', JSON.stringify(newLayout));
      return newLayout;
    });
  };

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

          <div className="tooltip tooltip-bottom" data-tip="Layout setting">
            <button
              className={clsx(
                'btn btn-circle btn-ghost',
                openLayoutSetting && 'btn-active',
              )}
              onClick={() => setOpenLayoutSetting((prev) => !prev)}
            >
              <TuneIcon className="size-5" />
            </button>
          </div>
          <div>
            <button
              className="btn btn-circle btn-ghost"
              onClick={() => setNavMode(NavMode.Traditional)}
            >
              <SelfImprovementIcon className="size-6" />
            </button>
          </div>
          <div className="tooltip tooltip-bottom" data-tip="Filter">
            <button className="btn btn-circle btn-ghost">
              <FilterAltIcon className="size-5" />
            </button>
          </div>
        </PageHeader>

        <div className="px-0 pt-2 sm:px-4">
          <Photos data={photoGroups} layout={photosLayout} />
        </div>
      </div>

      <PhotosLayoutSetting
        open={openLayoutSetting}
        setting={photosLayout}
        onClose={() => setOpenLayoutSetting(false)}
        onChange={handleLayoutChange}
      />
    </>
  );
}
