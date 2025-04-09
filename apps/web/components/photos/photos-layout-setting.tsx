import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

import { DEFAULT_PHOTOS_LAYOUT } from '~/config/constants';
import { GalleryLayout, GroupBy } from '~/config/enums';
import CloseIcon from '~/icons/close-icon';
import Dashboard from '~/icons/dashboard';
import GridView from '~/icons/grid-view';

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
    [GalleryLayout.Grid]: t('photos.grid'),
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
          <div className="m-auto mt-2 flex flex-wrap space-y-2 space-x-2">
            {Object.values(GalleryLayout).map((layoutType) => (
              <button
                key={layoutType}
                className={clsx(
                  'btn flex h-14 w-32 flex-row',
                  layout.layout === layoutType && 'btn-primary',
                )}
                name="options"
                disabled={layoutType === GalleryLayout.Masonry}
                onClick={() => handleLayoutChange({ layout: layoutType })}
                aria-label={localeMapping[layoutType]}
              >
                {layoutType === GalleryLayout.Grid && (
                  <GridView className="size-5" />
                )}
                {layoutType === GalleryLayout.Justified && (
                  <Dashboard className="size-5 rotate-90" />
                )}
                {layoutType === GalleryLayout.Grid1x1 && (
                  <GridView className="size-5" />
                )}
                {layoutType === GalleryLayout.Masonry && (
                  <Dashboard className="size-5" />
                )}
                {localeMapping[layoutType]}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <span className="block">{t('photos.size')}</span>
          <RangeWithButtons
            min={100}
            max={600}
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
          <div className="w-full max-w-xs">
            <input
              type="range"
              min={0}
              disabled={layout.layout === GalleryLayout.Grid}
              max={70}
              value={layout.roundedCorner}
              className="range"
              step={10}
              onChange={(value) =>
                handleLayoutChange({
                  roundedCorner: Number(value.target.value),
                })
              }
            />
            <div className="mt-2 flex justify-between px-2.5 text-xs">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
            <div className="mt-2 flex justify-between px-2.5 text-xs">
              <span>0</span>
              <span>4</span>
              <span>8</span>
              <span>16</span>
              <span>24</span>
              <span>32</span>
              <span>48</span>
              <span>∞</span>
            </div>
          </div>
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
