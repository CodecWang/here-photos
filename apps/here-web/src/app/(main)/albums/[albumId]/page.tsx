'use client';

import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import React from 'react';

import { photosLayoutAtom } from '~/atoms';
import EmptyUI from '~/components/empty-ui';
import { IconButton } from '~/components/icon-button';
import PageHeader from '~/components/page-header';
import Photos from '~/components/photos';
import PhotoActions from '~/components/photos/photo-actions';
import PhotosLayout from '~/components/photos/photos-layout-setting';
import { Button } from '~/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty';
import AddPhotoAlternateIcon from '~/icons/add-photo-alternate-icon';
import TuneIcon from '~/icons/tune-icon';
import { request } from '~/utils/request';

import { groupPhotosByDate } from '../../photos/utils';
import DeleteAlbumModal from '../components/delete-album-modal';

import type { AlbumUIType, PhotoUIType } from '~/schemas';

interface PageProps extends React.PropsWithChildren {
  params: Promise<{ albumId: string }>;
}

export default function Page({ params }: PageProps) {
  const t = useTranslations();
  const photosLayout = useAtomValue(photosLayoutAtom);

  const { albumId } = React.use(params);
  const [album, setAlbum] = useState<AlbumUIType>();
  const [photos, setPhotos] = useState<PhotoUIType[]>([]);
  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);
  const [isOpenLayout, setIsOpenLayout] = useState(false);

  useEffect(() => {
    (async () => {
      const album = await request<AlbumUIType>(`/api/v1/albums/${albumId}`);
      if (album) {
        setAlbum(album);
      }
    })();
  }, [albumId]);

  useEffect(() => {
    if (!album || !album.AlbumPhoto.length) return;

    console.log(
      '>>> regrouping photos',
      album.AlbumPhoto.map((ap) => ap.Photo)
    );

    setPhotos(album.AlbumPhoto.map((ap) => ap.Photo));
  }, [album, setPhotos]);

  useEffect(() => {
    const groups = groupPhotosByDate(photos, photosLayout.timeline);
    setPhotoGroups(groups);
  }, [photos, photosLayout.timeline]);

  if (!album) {
    return <div></div>;
  }

  return (
    <>
      <div
        className={clsx(
          'absolute inset-0 overflow-y-auto overflow-x-hidden transition-all duration-500',
          isOpenLayout && 'sm:right-80'
        )}
      >
        <PageHeader title={album.title} backTarget="/albums">
          <div className="ar-wrap flex items-center">
            <button className="btn btn-ghost">
              <AddPhotoAlternateIcon className="size-5" />
              {t('albums.addPhotos')}
            </button>

            <IconButton
              active={isOpenLayout}
              icon={<TuneIcon />}
              aria-label={t('photos.layoutTip')}
              disabled={!photoGroups.length}
              tooltipContent={t('photos.layoutTip')}
              onClick={() => setIsOpenLayout((prev) => !prev)}
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
          </div>

          <PhotoActions />
        </PageHeader>
        <div className="pt-2">
          {!photoGroups.length && (
            <EmptyUI
              title="No Photos Yet"
              description="You haven't created any photos yet. Get started by adding or uploading your first photo."
              actions={
                <>
                  <Button>Add</Button>
                  <Button variant="outline">Upload</Button>
                </>
              }
            />
          )}
          <Photos data={photoGroups} />
        </div>
      </div>

      <PhotosLayout
        open={isOpenLayout}
        onClose={() => setIsOpenLayout(false)}
      />

      <DeleteAlbumModal album={album} />
    </>
  );
}
