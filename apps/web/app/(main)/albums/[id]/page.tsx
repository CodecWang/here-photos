'use client';
import { useEffect, useState } from 'react';

// import AddPhotos from '@/components/add-photos';
import PageHeader from '@/components/page-header';
import Photos from '@/components/photos';
import { DEFAULT_PHOTOS_LAYOUT } from '@/config/constants';
import AddPhotoAlternateIcon from '@/icons/add-photo-alternate-icon';

import { groupPhotoByDate } from '../../photos/utils';

export default function Page({ params }: { params: { id: string } }) {
  const [album, setAlbum] = useState<Album>();
  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);
  const [photosLayout, setPhotosLayout] = useState<PhotosLayout>(
    DEFAULT_PHOTOS_LAYOUT,
  );

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/v1/albums/${params.id}/photos`);
      const album = await response.json();
      console.log(album);

      setAlbum(album.data);
    })();
  }, [params.id]);

  useEffect(() => {
    if (!album || !album.photos.length) return;

    const photos = groupPhotoByDate(album.photos, photosLayout.groupBy);
    setPhotoGroups(photos);
  }, [album, photosLayout]);

  if (!album) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-grow">
      {/* <AddPhotos /> */}
      <PageHeader title={album.title} backTarget="/albums">
        <button className="btn btn-ghost">
          <AddPhotoAlternateIcon className="size-5" />
          Add photos
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => document.getElementById('my_modal_1').showModal()}
        >
          Delete
        </button>
      </PageHeader>
      <div className="px-4 pt-2">
        {photoGroups.length === 0 && (
          <div>
            empty
            <button className="btn btn-ghost">
              <AddPhotoAlternateIcon className="size-5" />
              Add photos
            </button>
          </div>
        )}
        <Photos data={photoGroups} layout={photosLayout} />
      </div>
    </div>
  );
}
