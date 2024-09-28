import { useRouter } from 'next/navigation';

import { request } from '~/utils/request';

interface DeleteAlbumModalProps {
  album: Album;
}

export default function DeleteAlbumModal({ album }: DeleteAlbumModalProps) {
  const router = useRouter();

  const deleteAlbum = async () => {
    const response = await request(`/api/v1/albums`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: [album.id] }),
    });
    // redirect to albums page
    // window.location.href = '/albums';
    response && router.replace('/albums');
  };

  return (
    <dialog id="delete-album-modal" className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Delete album?</h3>
        <p className="py-4">
          Deleting an album is permanent. Photos and videos that were in a
          deleted album remain in Here Photos.
        </p>
        <div className="modal-action">
          <form method="dialog space-x-2">
            <button className="btn" onClick={deleteAlbum}>
              Confirm
            </button>
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
