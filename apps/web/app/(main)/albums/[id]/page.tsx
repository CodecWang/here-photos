'use client';
import { useEffect, useState } from 'react';

import AddPhotos from '@/components/add-photos';
import PageHeader from '@/components/page-header';
import Photos from '@/components/photos';
import { DEFAULT_PHOTOS_LAYOUT } from '@/config/constants';
import AddPhotoAlternateIcon from '@/icons/add-photo-alternate-icon';

import { groupPhotoByDate } from '../../photos/utils';

export default function Page({ params }: { params: { id: string } }) {
  const [album, setAlbum] = useState<Album>();
  const [photoGroups, setPhotoGroups] = useState<PhotoGroup[]>([]);
  const [photosView, setPhotosView] = useState<PhotosViewSetting>(
    DEFAULT_PHOTOS_LAYOUT
  );

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/v1/albums/${params.id}/photos`);
      const album = await response.json();
      setAlbum(album);
    })();
  }, [params.id]);

  useEffect(() => {
    if (!album || !album.photos.length) return;

    const photos = groupPhotoByDate(album.photos, photosView.groupBy);
    setPhotoGroups(photos);
  }, [album, photosView]);

  if (!album) {
    return <div>Loading...</div>;
  }

  const deleteAlbum = async () => {
    const response = await fetch(`/api/v1/albums`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ albumIds: [album.id] }),
    });
    if (response.ok) {
      // redirect to albums page
      window.location.href = '/albums';
    }
  };

  return (
    <div className="flex-grow">
      <AddPhotos />
      <PageHeader title={album.title}>
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
        <Photos data={photoGroups} view={photosView} />
      </div>

      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Delete album?</h3>
          <p className="py-4">
            Deleting an album is permanent. Photos and videos that were in a
            deleted album remain in Here Photos.
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
              <button
                className="btn"
                onClick={async (e) => {
                  await deleteAlbum();
                }}
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
