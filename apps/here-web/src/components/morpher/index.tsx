import { motion } from 'framer-motion';
import { useAtom } from 'jotai';

import MorpherAddToAlbums from './morpher-add-to-albums';
import MorpherDeletePhotos from './morpher-delete-photos';
import MorpherDock from './morpher-dock';
import MorpherNavBar from './morpher-nav-bar';
import MorPherPhotosLayout from './morpher-photos-layout';

import { morpherActionAtom } from '~/atoms';

export default function Morpher() {
  const [morpherAction, setMorpherAction] = useAtom(morpherActionAtom);

  const actions = {
    'nav-bar': {
      layout: { width: 300, height: 45, radius: 9999 },
      render: <MorpherNavBar />,
    },
    modal: {
      layout: { width: 300, height: 400, radius: 32 },
      render: (
        <motion.div
          key="dialog"
          className="flex flex-col items-center justify-center h-full w-full px-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <p className="mb-3 text-gray-800 font-medium">确定要删除吗？</p>
          <div className="flex gap-3">
            <button
              onClick={() => setMorpherAction('nav-bar')}
              className="px-3 py-1 bg-gray-200 rounded-md"
            >
              取消
            </button>
            <button className="px-3 py-1 bg-red-500 text-white rounded-md">
              删除
            </button>
          </div>
        </motion.div>
      ),
    },
    'photos-layout': {
      layout: { width: 320, height: 500, radius: 32 },
      showBackdrop: true,
      backdropClosable: true,
      render: <MorPherPhotosLayout />,
    },
    'delete-photos': {
      layout: { width: 320, height: 280, radius: 32 },
      showBackdrop: true,
      backdropClosable: true,
      render: <MorpherDeletePhotos />,
    },
    'add-to-albums': {
      layout: { width: 320, height: 400, radius: 32 },
      showBackdrop: true,
      backdropClosable: true,
      render: <MorpherAddToAlbums />,
    },
    'add-to-albums-expanded': {
      layout: { width: '100%', height: 500, radius: 32 },
      showBackdrop: true,
      backdropClosable: true,
      render: <MorpherAddToAlbums />,
    },
  };

  return <MorpherDock actions={actions} />;
}
