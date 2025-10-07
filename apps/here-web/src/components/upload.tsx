import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import UploadIcon from '~/icons/upload-icon';

import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function Upload() {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    console.log('>>> files to upload', files, formData);

    const data = await fetch('/api/v1/photos/upload', {
      method: 'POST',
      body: formData,
    });
    console.log('>>> upload response', data);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-full bg-transparent"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon />
            <span className="hidden md:inline">{t('photos.upload')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('photos.uploadTip')}</TooltipContent>
      </Tooltip>

      <input
        className="hidden"
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        onChange={handleFilesChange}
      />
    </>
  );
}
