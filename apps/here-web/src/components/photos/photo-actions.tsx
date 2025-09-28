import { useAtomValue } from 'jotai';
import { photosAtom } from '~/atoms';
import IconButton from '../ui/icon-button';
import { useTranslations } from 'next-intl';
import ShareIcon from '~/icons/share-icon';
import DeleteIcon from '~/icons/delete-icon';
import DeletePhotosModal from './delete-photos-modal';
import CreateNewFolderIcon from '~/icons/create-new-folder-icon';
import AddToAlbumModal from './add-to-album-modal';

export default function PhotoActions({
  onDelete,
  onAddToAlbum,
}: {
  onDelete?: () => void;
  onAddToAlbum?: () => void;
}) {
  const t = useTranslations();
  const photos = useAtomValue(photosAtom);
  const hasSelectedPhotos = photos.some((photo) => photo.selected);

  const selectedPhotoIds = photos
    .filter((photo) => photo.selected)
    .map((photo) => photo.id);

  if (!hasSelectedPhotos) return null;

  return (
    <>
      <div className="whitespace-nowrap ar-action-wrap ml-2">
        <IconButton
          tooltip={t('action.share')}
          disabled={true}
          // onClick={() => {}}
          icon={<ShareIcon className="size-5" />}
        />
        <IconButton
          tooltip={t('photos.addToAlbum')}
          onClick={() => {
            const dialog = document.getElementById('add-to-album-modal');
            dialog?.showModal();
          }}
          icon={<CreateNewFolderIcon className="size-5" />}
        />
        <IconButton
          tooltip={t('action.delete')}
          onClick={() => {
            const dialog = document.getElementById('delete-photos-modal');
            dialog?.showModal();
          }}
          icon={<DeleteIcon className="size-5" />}
        />
      </div>

      <DeletePhotosModal photoIds={selectedPhotoIds} onConfirm={onDelete} />

      <AddToAlbumModal photoIds={selectedPhotoIds} onConfirm={onAddToAlbum} />
    </>
  );
}
