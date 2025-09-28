import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { request } from '~/utils/request';

export default function CreateAlbumModal() {
  const t = useTranslations();
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      console.log('close -- need to reset value');
      // dialogRef.current?.reset();
    };

    dialog.addEventListener('close', handleClose);
    return () => {
      dialog.removeEventListener('close', handleClose);
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const response = await request(`/api/v1/albums`, {
      method: 'POST',
      body: JSON.stringify({
        title: formData.get('albumName'),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    router.push(`/albums/${response.data.id}`);
    dialogRef.current?.close();
  };

  const Album = () => (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">{t('albums.albumName')}</span>
      </div>
      <input
        type="text"
        name="albumName"
        placeholder="Type here"
        required
        className="input input-bordered peer w-full max-w-xs"
      />
      <p className="invisible text-xs text-gray-500 transition-all peer-invalid:visible">
        Album name is required
      </p>
    </label>
  );

  return (
    <dialog
      ref={dialogRef}
      id="create-album-modal"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box flex flex-col">
        <form onSubmit={handleFormSubmit}>
          <div className="join self-center">
            <input
              className="btn join-item"
              type="radio"
              name="options"
              aria-label={t('albums.album')}
              checked={true}
            />
          </div>
          <div className="py-4">
            <Album />
          </div>
          <div className="modal-action">
            <button
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                dialogRef.current?.close();
              }}
            >
              {t('action.close')}
            </button>
            <button className="btn btn-primary" type="submit">
              {t('action.confirm')}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
