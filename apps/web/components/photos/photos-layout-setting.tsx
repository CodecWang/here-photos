import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

import { DEFAULT_PHOTOS_LAYOUT } from '~/config/constants';
import { GalleryLayout, GroupBy } from '~/config/enums';
import CloseIcon from '~/icons/close-icon';

import RangeWithButtons from '../range-with-buttons';

interface PhotosLayoutSettingProps {
  open: boolean;
  onClose: () => void;
  onChange: (newSettings: PhotosLayout) => void;
}

function getCachedLayout() {
  const value = localStorage.getItem('photos-layout');
  try {
    const cachedLayout = JSON.parse(value || '{}');
    return { ...DEFAULT_PHOTOS_LAYOUT, ...cachedLayout };
  } catch (error) {
    return DEFAULT_PHOTOS_LAYOUT;
  }
}

export default function PhotosLayoutSetting({
  open,
  onClose,
  onChange,
}: PhotosLayoutSettingProps) {
  const t = useTranslations();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<PhotosLayout>(getCachedLayout());

  useEffect(() => {
    onChange(layout);
  }, [layout, onChange]);

  const handleLayoutChange = useCallback((newView: Partial<PhotosLayout>) => {
    setLayout((prev) => {
      const newLayout = { ...prev, ...newView };
      localStorage.setItem('photos-layout', JSON.stringify(newLayout));
      return newLayout;
    });
  }, []);

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

  const localeMapping = {
    // [GalleryLayout.Grid]: t('photos.grid'),
    [GalleryLayout.Grid1x1]: t('photos.grid1x1'),
    [GalleryLayout.Justified]: t('photos.justified'),
    [GalleryLayout.Masonry]: t('photos.masonry'),
    [GroupBy.None]: t('photos.noGrouping'),
    [GroupBy.Day]: t('photos.groupByDay'),
    [GroupBy.Month]: t('photos.groupByMonth'),
    [GroupBy.Year]: t('photos.groupByYear'),
  };

  return (
    <aside
      ref={sidebarRef}
      className="bg-base-100 sm:border-l-base-content/10 absolute inset-y-0 right-0 z-10 hidden w-full overflow-y-auto p-4 transition-all duration-500 sm:w-80 sm:border-l"
    >
      <div className="mb-4 flex items-center space-x-1 sm:hidden">
        <button className="btn btn-ghost btn-circle" onClick={onClose}>
          <CloseIcon className="size-5" />
        </button>
        <span className="text-lg">{t('photos.layoutTip')}</span>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="join m-auto mt-2">
            {Object.values(GalleryLayout).map((layoutType) => (
              <input
                key={layoutType}
                className="btn btn-ghost btn-outline join-item"
                type="radio"
                name="options"
                checked={layout.layout === layoutType}
                disabled={layoutType === GalleryLayout.Masonry}
                onChange={() => handleLayoutChange({ layout: layoutType })}
                aria-label={localeMapping[layoutType]}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <span className="block">{t('photos.size')}</span>
          <RangeWithButtons
            min={100}
            max={500}
            step={100}
            value={layout.size}
            onChange={(value) => handleLayoutChange({ size: value })}
          />
        </div>
        <div className="space-y-2">
          <span className="block">{t('photos.spacing')}</span>
          <RangeWithButtons
            min={0}
            max={24}
            value={layout.spacing}
            onChange={(value) => handleLayoutChange({ spacing: value })}
          />
        </div>
        <div className="space-y-2">
          <span className="block">{t('photos.cornerRadius')}</span>
          <RangeWithButtons
            min={0}
            max={8}
            value={layout.cornerRadius}
            onChange={(value) => handleLayoutChange({ cornerRadius: value })}
          />
        </div>
        <div className="space-y-2">
          <span className="block">{t('photos.group')}</span>
          <select
            className="select select-bordered w-full max-w-xs"
            value={layout.groupBy}
            onChange={(e) => handleLayoutChange({ groupBy: e.target.value })}
          >
            {Object.values(GroupBy).map((value) => (
              <option
                key={value}
                value={value}
                disabled={layout.groupBy === value}
              >
                {localeMapping[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="divider"></div>
      <button
        className="btn"
        onClick={() => handleLayoutChange(DEFAULT_PHOTOS_LAYOUT)}
      >
        {t('photos.resetToDefault')}
      </button>
    </aside>
  );
}
