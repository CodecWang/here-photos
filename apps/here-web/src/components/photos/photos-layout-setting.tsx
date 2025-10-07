import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef } from 'react';

import { photosLayoutAtom } from '~/atoms';
import CloseIcon from '~/icons/close-icon';
import Dashboard from '~/icons/dashboard';
import GridView from '~/icons/grid-view';
import {
  GalleryArrange,
  PhotosLayoutSchema,
  PhotosLayoutType,
  TimelineGroup,
} from '~/schemas';

import { IconButton } from '../icon-button';
import RangeWithButtons from '../range-with-buttons';
import { Button } from '../ui/button';

interface PhotosLayoutProps {
  open: boolean;
  onClose: () => void;
}

export default function PhotosLayout({ open, onClose }: PhotosLayoutProps) {
  const t = useTranslations();
  const [photosLayout, setPhotosLayout] = useAtom(photosLayoutAtom);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleLayoutChange = useCallback(
    (newView: Partial<PhotosLayoutType>) => {
      setPhotosLayout((prev) => {
        const newLayout = { ...prev, ...newView };
        return newLayout;
      });
    },
    []
  );

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
    [GalleryArrange.Grid]: t('photos.grid'),
    [GalleryArrange.Grid1x1]: t('photos.grid1x1'),
    [GalleryArrange.Justified]: t('photos.justified'),
    [GalleryArrange.Masonry]: t('photos.masonry'),
    [TimelineGroup.None]: t('photos.noTimeline'),
    [TimelineGroup.Day]: t('photos.TimelineByDay'),
    [TimelineGroup.Month]: t('photos.TimelineByMonth'),
    [TimelineGroup.Year]: t('photos.TimelineByYear'),
  };

  return (
    <aside
      ref={sidebarRef}
      className="bg-background sm:border-l-base-content/10 absolute inset-y-0 right-0 z-10 hidden w-full overflow-y-auto p-4 transition-all duration-500 sm:w-80 sm:border-l"
    >
      <div className="pb-4 flex items-center space-x-1">
        <h3 className="text-lg flex-1">{t('photos.layoutTip')}</h3>
        <IconButton
          icon={<CloseIcon />}
          className="ml-auto"
          aria-label={t('action.close')}
          tooltipContent={t('action.close')}
          onClick={onClose}
        />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="m-auto mt-2 flex flex-wrap space-y-2 space-x-2">
            {Object.values(GalleryArrange).map((arrange) => (
              <button
                key={arrange}
                className={clsx(
                  'btn flex h-14 w-32 flex-row',
                  photosLayout.arrange === arrange && 'btn-primary'
                )}
                name="options"
                disabled={arrange === GalleryArrange.Masonry}
                onClick={() => handleLayoutChange({ arrange })}
                aria-label={localeMapping[arrange]}
              >
                {arrange === GalleryArrange.Grid && (
                  <GridView className="size-5" />
                )}
                {arrange === GalleryArrange.Justified && (
                  <Dashboard className="size-5 rotate-90" />
                )}
                {arrange === GalleryArrange.Grid1x1 && (
                  <GridView className="size-5" />
                )}
                {arrange === GalleryArrange.Masonry && (
                  <Dashboard className="size-5" />
                )}
                {localeMapping[arrange]}
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
            value={photosLayout.size}
            onChange={(value) => handleLayoutChange({ size: value })}
          />
        </div>
        <div className="space-y-2">
          <span className="block">{t('photos.spacing')}</span>
          <RangeWithButtons
            min={0}
            max={24}
            value={photosLayout.spacing}
            onChange={(value) => handleLayoutChange({ spacing: value })}
          />
        </div>
        <div className="space-y-2">
          <span className="block">{t('photos.cornerRadius')}</span>
          <div className="w-full max-w-xs">
            <input
              type="range"
              min={0}
              disabled={photosLayout.arrange === GalleryArrange.Grid}
              max={70}
              value={photosLayout.roundedCorner}
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
          <span className="block">{t('photos.timeline')}</span>
          <select
            className="select select-bordered w-full max-w-xs"
            value={photosLayout.timeline}
            onChange={(e) =>
              handleLayoutChange({ timeline: e.target.value as TimelineGroup })
            }
          >
            {Object.values(TimelineGroup).map((value) => (
              <option
                key={value}
                value={value}
                disabled={photosLayout.timeline === value}
              >
                {localeMapping[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="divider"></div>
      <Button onClick={() => handleLayoutChange(PhotosLayoutSchema.parse({}))}>
        {t('photos.resetToDefault')}
      </Button>
    </aside>
  );
}
