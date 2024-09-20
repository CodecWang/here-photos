import { useRef } from 'react';

import UploadIcon from '@/icons/upload-icon';

export default function Upload() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    await fetch('/api/v1/photos/upload', {
      method: 'POST',
      body: formData,
    });
  };

  return (
    <div className="tooltip tooltip-bottom" data-tip="Upload photos">
      <button
        className="btn btn-ghost"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadIcon className="size-6 md:size-5" />
        <span className="hidden md:inline">Upload</span>
      </button>

      <input
        className="hidden"
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        onChange={handleFilesChange}
      />
    </div>
  );
}
