import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useTranslations } from 'next-intl';

import { morpherActionAtom, photosAtom, selectedPhotoIdsAtom } from '~/atoms';
import CreateNewFolderIcon from '~/icons/create-new-folder-icon';
import DeleteIcon from '~/icons/delete-icon';
import InkSelectionIcon from '~/icons/ink-selection-icon';
import RemoveSelectionIcon from '~/icons/remove-selection-icon';
import ShareIcon from '~/icons/share-icon';

import { IconButton } from '../icon-button';

import AddToAlbumModal from './add-to-album-modal';
import DeletePhotosModal from './delete-photos-modal';

export default function PhotoActions(props: {
  albumId?: string;
  onDelete?: (photoIds: string[]) => void;
  onAddToAlbum?: () => void;
}) {
  console.log('>>>> ', props);
  const { albumId, onDelete, onAddToAlbum } = props;
  const t = useTranslations();
  const photos = useAtomValue(photosAtom);
  const setmorpherAction = useSetAtom(morpherActionAtom);
  const [selectedPhotoIds, setSelectedPhotoIds] = useAtom(selectedPhotoIdsAtom);

  const onClearSelection = () => {
    setSelectedPhotoIds(new Set());
  };

  const onSelectAll = () => {
    setSelectedPhotoIds(new Set(photos.map((p) => p.photoId)));
  };

  if (selectedPhotoIds.size === 0) return null;

  return (
    <>
      <div className="whitespace-nowrap ml-2 flex items-center space-x-1 ar-wrap">
        <IconButton
          aria-label={t('action.selectAll')}
          tooltipContent={t('action.selectAll')}
          icon={<InkSelectionIcon />}
          onClick={onSelectAll}
        />
        <IconButton
          aria-label={t('action.clearSelection')}
          tooltipContent={t('action.clearSelection')}
          icon={<RemoveSelectionIcon />}
          onClick={onClearSelection}
        />

        <span className="pr-3 text-sm text-neutral-500">
          {t('photos.numSelected', { count: selectedPhotoIds.size })}
        </span>

        <div className="h-5 w-px bg-neutral-500" />

        <IconButton
          aria-label={t('action.share')}
          // disabled={true}
          tooltipContent={t('action.share')}
          icon={<ShareIcon />}
        />
        {/* <AddToAlbumModal
          photoIds={Array.from(selectedPhotoIds)}
          onConfirm={onAddToAlbum}
        /> */}
        <IconButton
          aria-label={t('action.delete')}
          tooltipContent={t('action.delete')}
          icon={<CreateNewFolderIcon />}
          // onClick={onClearSelection}
          onClick={() => setmorpherAction('add-to-albums')}
        />
        <IconButton
          aria-label={t('action.delete')}
          tooltipContent={t('action.delete')}
          icon={<DeleteIcon />}
          // onClick={onClearSelection}
          onClick={() => setmorpherAction('delete-photos')}
        />
        {/* <DeletePhotosModal
          photoIds={Array.from(selectedPhotoIds)}
          onConfirm={onDelete}
        /> */}
      </div>
    </>
  );
}
