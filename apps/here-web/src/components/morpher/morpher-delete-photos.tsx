import { useAtom, useSetAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import { IconButton } from '../icon-button';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Spinner } from '../ui/spinner';

import { morpherActionAtom, selectedPhotoIdsAtom } from '~/atoms';
import CloseIcon from '~/icons/close-icon';
import { request } from '~/utils/request';

export default function MorpherDeletePhotos() {
  const t = useTranslations();
  const setMorpherAction = useSetAtom(morpherActionAtom);
  const [selectedPhotoIds, setSelectedPhotoIds] = useAtom(selectedPhotoIdsAtom);
  const [loading, setLoading] = useState(false);

  const deletePhotos = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      setLoading(true);

      const response = await request(`/api/v1/photos`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoIds: Array.from(selectedPhotoIds) }),
      });

      console.log('delete photos response', response);
      if (response && response.count) {
        setLoading(false);
        // setOpen(false);
        // onConfirm?.(photoIds);
      }
    },
    [selectedPhotoIds]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <h1 className="text-xl">{t('action.delete')}</h1>
        <p className="mt-3 text-sm text-neutral-500">
          Temp: 你将要删除xxx张照片，删除后可以在回收站找回
        </p>
        <div className="flex items-center gap-3 mt-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">同时删除原始文件</Label>
        </div>
        <Button
          className="rounded-full w-full mt-6"
          variant="destructive"
          onClick={deletePhotos}
          disabled={loading}
        >
          {loading && <Spinner />} {t('action.confirm')}
        </Button>
      </div>

      <div className="p-4 border-t flex justify-center">
        <IconButton
          active={true}
          icon={<CloseIcon />}
          aria-label={t('action.close')}
          tooltipContent={t('action.close')}
          onClick={() => setMorpherAction('nav-bar')}
        />
      </div>
    </div>
  );
}
