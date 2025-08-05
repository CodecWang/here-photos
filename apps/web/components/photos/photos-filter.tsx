import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

import { DEFAULT_PHOTOS_LAYOUT } from '~/config/constants';
import { GalleryLayout, GroupBy } from '~/config/enums';
import CloseIcon from '~/icons/close-icon';
import Dashboard from '~/icons/dashboard';
import GridView from '~/icons/grid-view';

import RangeWithButtons from '../range-with-buttons';

interface PhotosFilterProps {
  open: boolean;
  onClose: () => void;
  onChange: (newSettings: PhotosLayout) => void;
}

export default function PhotosFilter({
  open,
  onClose,
  onChange,
}: PhotosFilterProps) {
  const t = useTranslations();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sidebarRef.current) return;

    const sidebar = sidebarRef.current;
    if (open) {
      sidebar.classList.toggle('hidden');
      setTimeout(() => {
        sidebar.classList.remove('translate-x-full', 'sm:translate-x-80');
        sidebar.classList.add('translate-x-0');
      }, 0);
    } else {
      sidebar.classList.remove('translate-x-0');
      sidebar.classList.add('translate-x-full', 'sm:translate-x-80');
      setTimeout(() => sidebar.classList.toggle('hidden'), 500);
    }
  }, [open]);

  return (
    <aside
      ref={sidebarRef}
      className="bg-base-100 sm:border-l-base-content/10 absolute inset-y-0 right-0 z-10 hidden w-full overflow-y-auto p-4 transition-all duration-500 sm:w-80 sm:border-l"
    >
      <div className="mb-4 flex items-center space-x-1 sm:hidden">
        <button className="btn btn-ghost btn-circle" onClick={onClose}>
          <CloseIcon className="size-5" />
        </button>
        <span className="text-lg">{t('photos.filterTip')}</span>
      </div>
      <div className="space-y-4">
        <div className="space-y-2"></div>
      </div>

      <div className="divider"></div>
      <button className="btn">{t('photos.resetToDefault')}</button>
    </aside>
  );
}
