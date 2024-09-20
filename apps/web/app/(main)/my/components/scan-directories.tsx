import { useState } from 'react';

import IconButton from '@/components/ui/icon-button';
import CheckIcon from '@/icons/check-icon';
import DeleteIcon from '@/icons/delete-icon';
import EditIcon from '@/icons/edit-icon';
import { request } from '@/utils/request';

interface ScanDirectoriesProps {
  photoDirs: string[];
  onChange: (photoDirs: string[]) => Promise<void>;
}

export default function ScanDirectories({
  photoDirs,
  onChange,
}: ScanDirectoriesProps) {
  const [newDir, setNewDir] = useState('');
  const [showAdding, setShowAdding] = useState(false);

  const triggerScan = async () => {
    await request('/api/v1/scan', {
      method: 'POST',
    });
  };

  const addNewDirectory = async () => {
    if (photoDirs.includes(newDir)) return hideAdding();

    await onChange([...photoDirs, newDir]);
    await triggerScan();
    hideAdding();
  };

  const deleteDirectory = async (targetDir: string) => {
    await onChange(photoDirs.filter((dir) => dir !== targetDir));
    await triggerScan();
    hideAdding();
  };

  const hideAdding = () => {
    setNewDir('');
    setShowAdding(false);
  };

  return (
    <div className="bg-base-200 rounded-box flex-[2] p-4 hover:shadow-2xl">
      <div className="flex items-center">
        <span className="text-xl">Directories</span>

        <div className="flex flex-1 justify-end">
          <button className="btn" onClick={() => setShowAdding(true)}>
            Add
          </button>
          <button className="btn btn-primary" onClick={triggerScan}>
            Scan
          </button>
        </div>
      </div>
      <div className="mt-2 space-y-2">
        {showAdding && (
          <div className="flex items-center">
            <input
              type="text"
              className="input input-bordered w-full"
              value={newDir}
              onChange={(e) => setNewDir(e.target.value)}
            />
            <IconButton
              tooltip="Confirm"
              onClick={addNewDirectory}
              icon={<CheckIcon className="size-5" />}
            />
            <IconButton
              tooltip="Delete"
              onClick={hideAdding}
              icon={<DeleteIcon className="size-5" />}
            />
          </div>
        )}
        {photoDirs.map((dir) => (
          <div className="flex items-center" key={dir}>
            <input
              type="text"
              value={dir}
              className="input input-bordered w-full"
              disabled
            />
            <IconButton
              tooltip="Edit"
              icon={<EditIcon className="size-5" />}
              disabled
            />
            <IconButton
              tooltip="Delete"
              icon={<DeleteIcon className="size-5" />}
              onClick={() => deleteDirectory(dir)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
