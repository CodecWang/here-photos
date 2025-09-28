import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { request } from '~/utils/request';

export default function DeletePhotosModal({
  photoIds,
  onConfirm,
}: {
  photoIds: number[];
  onConfirm?: () => void;
}) {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const deletePhotos = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setLoading(true);
    const response = await request(`/api/v1/photos`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: photoIds }),
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
    <dialog id="delete-photos-modal" className="modal" ref={dialogRef}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">{t('action.delete')}</h3>
        <p className="py-4">
          Temp: 你将要删除xxx张照片，删除后可以在回收站找回
        </p>
        <div className="modal-action">
          <form method="dialog space-x-2">
            <button className="btn" onClick={deletePhotos}>
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
