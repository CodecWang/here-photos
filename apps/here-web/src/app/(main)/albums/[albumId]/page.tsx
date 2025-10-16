'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import React from 'react';

import { IconButton } from '~/components/icon-button';
import PageHeader from '~/components/page-header';
import Photos from '~/components/photos';
import PhotoActions from '~/components/photos/photo-actions';
import PhotosLayout from '~/components/photos/photos-layout';
import { usePhotoGroups } from '~/hooks/use-photo-groups';
import AddPhotoAlternateIcon from '~/icons/add-photo-alternate-icon';
import TuneIcon from '~/icons/tune-icon';
import { request } from '~/utils/request';

import DeleteAlbumModal from '../components/delete-album-modal';

import type { AlbumDTO } from '@here-photos/dto';

interface PageProps extends React.PropsWithChildren {
  params: Promise<{ albumId: string }>;
}

export default function Page({ params }: PageProps) {
  const t = useTranslations();

  const { albumId } = React.use(params);
  const [album, setAlbum] = useState<AlbumDTO>();
  const { photoGroups, loading } = usePhotoGroups({ albumId });
  const [isOpenLayout, setIsOpenLayout] = useState(false);

  useEffect(() => {
    (async () => {
      const album = await request<AlbumDTO>(`/api/v1/albums/${albumId}`);
      if (!album) {
        // TODO(arthur): do nothing for now, unify not found/error handling/suspense boundaries later
        throw new Error('Failed to load album');
      }
      setAlbum(album);
    })();
  }, []);

  return (
    <>
      <div
        className={clsx(
          'absolute inset-0 overflow-y-auto overflow-x-hidden transition-all duration-500',
          isOpenLayout && 'sm:right-80'
        )}
      >
        <PageHeader title={album?.title ?? ''} backTarget="/albums">
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
          <Photos data={photoGroups} albumId={albumId} />
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
