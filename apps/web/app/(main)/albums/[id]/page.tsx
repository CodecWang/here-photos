'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

// import AddPhotos from '~/components/add-photos';
import PageHeader from '~/components/page-header';
import Photos from '~/components/photos';
import PhotosLayoutSetting from '~/components/photos/photos-layout-setting';
import IconButton from '~/components/ui/icon-button';
import { DEFAULT_PHOTOS_LAYOUT } from '~/config/constants';
import AddPhotoAlternateIcon from '~/icons/add-photo-alternate-icon';
import TuneIcon from '~/icons/tune-icon';
import { request } from '~/utils/request';

import { groupPhotosByDate } from '../../photos/utils';
import DeleteAlbumModal from '../components/delete-album-modal';

export default function Page({ params }: { params: { id: string } }) {
  const [album, setAlbum] = useState<Album>();
  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);
  const [openLayoutSetting, setOpenLayoutSetting] = useState(false);
  const [layout, setLayout] = useState<PhotosLayout>(DEFAULT_PHOTOS_LAYOUT);

  useEffect(() => {
    (async () => {
      const album = await request(`/api/v1/albums/${params.id}/photos`);
      album && setAlbum(album.data);
    })();
  }, [params.id]);

  useEffect(() => {
    if (!album?.photos.length) return;

    console.log('>>> regrouping photos');

    const groups = groupPhotosByDate(album.photos, layout.groupBy);
    setPhotoGroups(groups);
  }, [album?.photos, layout.groupBy]);

  if (!album) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div
        className={clsx(
          'absolute inset-0 overflow-y-auto overflow-x-hidden transition-all duration-500',
          openLayoutSetting && 'sm:right-80',
        )}
      >
        {/* <AddPhotos /> */}
        <PageHeader title={album.title} backTarget="/albums">
          <button className="btn btn-ghost">
            <AddPhotoAlternateIcon className="size-5" />
            Add photos
          </button>

          <IconButton
            active={openLayoutSetting}
            disabled={!photoGroups.length}
            tooltip="Layout setting"
            onClick={() => setOpenLayoutSetting((prev) => !prev)}
            icon={<TuneIcon className="size-5" />}
          />

          <button
            className="btn btn-ghost"
            onClick={() =>
              (
                document.getElementById(
                  'delete-album-modal',
                ) as HTMLDialogElement
              )?.showModal()
            }
          >
            Delete
          </button>
        </PageHeader>
        <div className="px-0 pt-2 sm:px-4">
          {!photoGroups.length && (
            <div>
              empty
              <button className="btn btn-ghost">
                <AddPhotoAlternateIcon className="size-5" />
                Add photos
              </button>
            </div>
          )}
          <Photos data={photoGroups} layout={layout} />
        </div>
      </div>

      <PhotosLayoutSetting
        open={openLayoutSetting}
        onChange={setLayout}
        onClose={() => setOpenLayoutSetting(false)}
      />

      <DeleteAlbumModal album={album} />
    </>
  );
}
