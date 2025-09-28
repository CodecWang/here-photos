import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { request } from '~/utils/request';

export default function AddToAlbumModal({
  photoIds,
  onConfirm,
}: {
  photoIds: number[];
  onConfirm?: () => void;
}) {
  const t = useTranslations();
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    (async () => {
      const albums = await request('/api/v1/albums');
      albums && setAlbums(albums.data);
    })();
  }, []);

  const addToAlbum = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setLoading(true);
    console.log('>>>', selectedAlbum);
    const response = await request(`/api/v1/albums/${selectedAlbum}/photos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photoIds }),
    });

    if (response.code === 0) {
      dialogRef.current?.close();
      setLoading(false);
      onConfirm?.();
    }
  };

  const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dialogRef.current?.close();
  };

  return (
    <dialog id="add-to-album-modal" className="modal" ref={dialogRef}>
      <div className="modal-box">
        <select
          defaultValue={selectedAlbum}
          className="select"
          onChange={(e) => setSelectedAlbum(Number(e.target.value))}
        >
          {/* TODO(arthur): multi select */}
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.title}
            </option>
          ))}
        </select>

        <div className="modal-action">
          <form method="dialog space-x-2">
            <button className="btn" onClick={addToAlbum} disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                t('action.confirm')
              )}
            </button>
            <button className="btn" onClick={closeModal}>
              {t('action.close')}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
