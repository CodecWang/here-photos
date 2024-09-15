import { useEffect, useState } from 'react';

import CloseIcon from '@/icons/close-icon';

import { usePhotos } from './context';

export default function PhotoViewer() {
  const { currentPhoto } = usePhotos();
  const [close, setClose] = useState(false);

  useEffect(() => {
    setClose(false);
  }, [currentPhoto]);

  if (!currentPhoto || close) return null;

  return (
    <div className="bg-base-100 fixed left-0 top-0 z-30 h-full w-full">
      <div className="flex h-full items-center justify-center">
        <img
          src={`/api/v1/photos/${currentPhoto.id}/thumbnail?variant=2`}
          alt=""
          className="max-h-full max-w-full"
        />
      </div>

      <button
        className="btn btn-circle btn-ghost absolute right-2 top-2"
        onClick={() => setClose(true)}
      >
        <CloseIcon className="size-5" />
      </button>
    </div>
  );
}
