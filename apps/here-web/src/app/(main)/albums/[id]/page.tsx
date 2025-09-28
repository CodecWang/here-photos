'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

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
import { useAtom } from 'jotai';
import { photosAtom } from '~/atoms';
import PhotoActions from '~/components/photos/photo-actions';

export default function Page({ params }: { params: { id: string } }) {
  const t = useTranslations();
  const [photos, setPhotos] = useAtom(photosAtom);
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
    if (!album) return;
    if (!album.photos.length) return;

    console.log('>>> regrouping photos');

    setPhotos(album.photos);
  }, [album, setPhotos]);

  useEffect(() => {
    const groups = groupPhotosByDate(photos, layout.groupBy);
    setPhotoGroups(groups);
  }, [photos, layout.groupBy]);

  if (!album) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div
        className={clsx(
          'absolute inset-0 overflow-y-auto overflow-x-hidden transition-all duration-500',
          openLayoutSetting && 'sm:right-80'
        )}
      >
        <PageHeader title={album.title} backTarget="/albums">
          <button className="btn btn-ghost">
            <AddPhotoAlternateIcon className="size-5" />
            {t('albums.addPhotos')}
          </button>

          <IconButton
            active={openLayoutSetting}
            disabled={!photoGroups.length}
            tooltip={t('photos.layoutTip')}
            onClick={() => setOpenLayoutSetting((prev) => !prev)}
            icon={<TuneIcon className="size-5" />}
          />

          <button
            className="btn btn-ghost"
            onClick={() =>
              (
                document.getElementById(
                  'delete-album-modal'
                ) as HTMLDialogElement
              )?.showModal()
            }
          >
            {t('action.delete')}
          </button>

          <PhotoActions />
        </PageHeader>
        <div className="pt-2">
          {!photoGroups.length && (
            <div>
              empty
              <button className="btn btn-ghost">
                <AddPhotoAlternateIcon className="size-5" />
                {t('albums.addPhotos')}
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
