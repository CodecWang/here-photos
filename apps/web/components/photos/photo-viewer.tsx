import { useEffect, useState } from 'react';

import CloseIcon from '@/icons/close-icon';
import DeleteIcon from '@/icons/delete-icon';

import IconButton from '../ui/icon-button';
import { usePhotos } from './context';

export default function PhotoViewer() {
  const { currentPhoto } = usePhotos();
  const [close, setClose] = useState(false);

  useEffect(() => {
    setClose(false);
  }, [currentPhoto]);

  const deletePhoto = async () => {
    if (!currentPhoto) return;

    await fetch('/api/v1/photos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: [(currentPhoto as Photo).id] }),
    });

    setClose(true);
  };

  if (!currentPhoto || close) return null;

  return (
    <div className="bg-base-100 fixed left-0 top-0 z-30 h-full w-full">
      <button
        className="btn btn-circle btn-ghost absolute left-2 top-2"
        onClick={() => setClose(true)}
      >
        <CloseIcon className="size-5" />
      </button>
      <div className="flex h-full items-center justify-center">
        <img
          src={`/api/v1/photos/${(currentPhoto as Photo).id}/thumbnail?variant=2`}
          alt=""
          className="max-h-full max-w-full"
        />
      </div>

      <div className="absolute right-2 top-2">
        <IconButton
          tooltip="Delete"
          onClick={deletePhoto}
          icon={<DeleteIcon className="size-5" />}
        />
      </div>
    </div>
  );
}
