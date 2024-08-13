import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CloseIcon from "@/icons/close-icon";

enum AlbumType {
  Album,
  SmartAlbum,
}

export default function CreateAlbumModal() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [albumType, setAlbumType] = useState<AlbumType>(AlbumType.Album);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      console.log("close -- need to reset value");
      // dialogRef.current?.reset();
    };

    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    // for (var [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    const response = await fetch(`/api/v1/albums`, {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("albumName"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const album = await response.json();
    router.push(`/albums/${album.id}`);
    dialogRef.current?.close();
  };

  const Album = () => (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">Album name</span>
      </div>
      <input
        type="text"
        name="albumName"
        placeholder="Type here"
        className="input input-bordered w-full max-w-xs"
      />
    </label>
  );

  const SmartAlbum = () => (
    <div>
      Create smart album
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Album name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
        />
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Album name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
        />
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Album name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
        />
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Album name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
        />
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Album name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
        />
      </label>
    </div>
  );

  return (
    <dialog
      ref={dialogRef}
      id="create-album-modal"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box flex flex-col">
        <button className="btn btn-circle btn-ghost absolute right-2 top-2">
          <CloseIcon className="size-5" />
        </button>
        <form onSubmit={handleFormSubmit}>
          <div className="join self-center">
            <input
              className="btn join-item"
              type="radio"
              name="options"
              aria-label="Album"
              checked={albumType === AlbumType.Album}
              onChange={() => setAlbumType(AlbumType.Album)}
            />
            <input
              className="btn join-item"
              type="radio"
              name="options"
              aria-label="Smart Album"
              checked={albumType === AlbumType.SmartAlbum}
              onChange={() => setAlbumType(AlbumType.SmartAlbum)}
            />
          </div>
          <div className="py-4">
            {albumType === AlbumType.Album ? <Album /> : <SmartAlbum />}
          </div>
          <div className="modal-action">
            <button
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                dialogRef.current?.close();
              }}
            >
              Close
            </button>
            <button className="btn btn-primary" type="submit">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
