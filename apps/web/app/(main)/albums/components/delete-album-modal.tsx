import { request } from '@/utils/request';
import { useRouter } from 'next/navigation';

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
      body: JSON.stringify({ albumIds: [album.id] }),
    });
    // redirect to albums page
    // window.location.href = '/albums';
    response && router.replace('/albums');
  };

  return (
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
  );
}
