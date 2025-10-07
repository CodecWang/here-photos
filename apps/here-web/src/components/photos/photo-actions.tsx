import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';

import { selectedPhotoIdsAtom } from '~/atoms';
import CreateNewFolderIcon from '~/icons/create-new-folder-icon';
import ShareIcon from '~/icons/share-icon';

import { IconButton } from '../icon-button';

import AddToAlbumModal from './add-to-album-modal';
import DeletePhotosModal from './delete-photos-modal';

export default function PhotoActions({
  onDelete,
  onAddToAlbum,
}: {
  onDelete?: () => void;
  onAddToAlbum?: () => void;
}) {
  const t = useTranslations();
  const selectedPhotoIds = useAtomValue(selectedPhotoIdsAtom);

  if (selectedPhotoIds.size === 0) return null;

  return (
    <>
      <div className="whitespace-nowrap ml-2 flex items-center space-x-1 bg-background border rounded-full p-1">
        <IconButton
          aria-label={t('action.share')}
          disabled={true}
          tooltipContent={t('action.share')}
          // onClick={() => {}}
          icon={<ShareIcon />}
        />
        <IconButton
          icon={<CreateNewFolderIcon />}
          aria-label={t('photos.addToAlbum')}
          tooltipContent={t('photos.addToAlbum')}
          onClick={() => {
            const dialog = document.getElementById('add-to-album-modal');
            dialog?.showModal();
          }}
        />
        <DeletePhotosModal
          photoIds={Array.from(selectedPhotoIds)}
          onConfirm={onDelete}
        />
      </div>
      <AddToAlbumModal
        photoIds={Array.from(selectedPhotoIds)}
        onConfirm={onAddToAlbum}
      />
    </>
  );
}
