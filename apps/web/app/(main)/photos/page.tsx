'use client';

import { useEffect, useState } from 'react';
import { useContext } from 'react';

import PageHeader from '@/components/page-header';
import Photos from '@/components/photos';
import Upload from '@/components/upload';
import { DEFAULT_PHOTOS_LAYOUT } from '@/config/constants';
import FilterAltIcon from '@/icons/filter-alt-icon';
import SelfImprovementIcon from '@/icons/self-improvement-icon';
import TuneIcon from '@/icons/tune-icon';
import { NavMode } from '@/types/enums';

import PhotosView from '../../../components/photos-view';
import { NavContext } from '../nav-provider';
import { groupPhotoByDate } from './utils';

export default function Page() {
  const { navMode, setNavMode } = useContext(NavContext);
  const [photos, setPhotos] = useState<any[]>([]);
  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);
  const [photosLayout, setPhotosLayout] = useState<PhotosLayout>(
    DEFAULT_PHOTOS_LAYOUT,
  );

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/v1/photos');
      const rawPhotos = await response.json();
      setPhotos(rawPhotos.data);
    })();
  }, []);

  useEffect(() => {
    if (!photos.length) return;

    const photoGroups = groupPhotoByDate(photos, photosLayout.groupBy);
    setPhotoGroups(photoGroups);
  }, [photos, photosLayout]);

  const handleViewChange = (newView: PhotosLayout) => {
    setPhotosLayout((prev) => ({ ...prev, ...newView }));
  };

  return (
    <>
      <div className="flex-grow overflow-auto">
        <PageHeader title="Photos">
          {navMode === NavMode.Modern && <Upload />}

          <div className="tooltip tooltip-bottom" data-tip="Layout setting">
            <button
              className="btn btn-circle btn-ghost"
              onClick={() => {
                const sidebar = document.getElementById('sidebar');

                sidebar.classList.toggle('hidden');
              }}
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

        <div className="flex-grow px-4 pt-2">
          <Photos data={photoGroups} layout={photosLayout} />
        </div>
      </div>
      <PhotosView view={photosLayout} onChange={handleViewChange} />
    </>
  );
}
