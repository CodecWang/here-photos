import { DEFAULT_PHOTOS_LAYOUT } from '@/config/constants';
import { GalleryLayout, GroupBy } from '@/types/enums';
import { useEffect, useRef } from 'react';
import RangeWithButtons from '../range-with-buttons';
import CloseIcon from '@/icons/close-icon';

interface PhotosLayoutSettingProps {
  open: boolean;
  setting: PhotosLayout;
  onClose: () => void;
  onChange: (newSettings: PhotosLayout) => void;
}

export default function PhotosLayoutSetting({
  open,
  setting,
  onClose,
  onChange,
}: PhotosLayoutSettingProps) {
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
        <span className="text-lg">Layout settings</span>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <span className="block">Layout</span>
          <div className="join m-auto mt-2">
            <input
              className="btn btn-ghost btn-outline join-item"
              type="radio"
              name="options"
              checked={setting.layout === GalleryLayout.Grid1x1}
              onChange={() => onChange({ layout: GalleryLayout.Grid1x1 })}
              aria-label="Grid"
            />
            <input
              className="btn btn-ghost btn-outline join-item"
              type="radio"
              name="options"
              checked={setting.layout === GalleryLayout.Justified}
              onChange={() => onChange({ layout: GalleryLayout.Justified })}
              aria-label="Justified"
            />
            <input
              className="btn btn-ghost btn-outline join-item"
              type="radio"
              name="options"
              checked={setting.layout === GalleryLayout.Masonry}
              onChange={() => onChange({ layout: GalleryLayout.Masonry })}
              aria-label="Masonry"
            />
          </div>
        </div>
        <div className="space-y-2">
          <span className="block">Size</span>
          <RangeWithButtons
            min={100}
            max={500}
            step={100}
            value={setting.size}
            onChange={(value) => onChange({ size: value })}
          />
        </div>
        <div className="space-y-2">
          <span className="block">Spacing</span>
          <RangeWithButtons
            min={0}
            max={24}
            value={setting.spacing}
            onChange={(value) => onChange({ spacing: value })}
          />
        </div>
        <div className="space-y-2">
          <span className="block">Corner radius</span>
          <RangeWithButtons
            min={0}
            max={8}
            value={setting.cornerRadius}
            onChange={(value) => onChange({ cornerRadius: value })}
          />
        </div>
        <div className="space-y-2">
          <span className="block">Group</span>
          <select
            className="select select-bordered w-full max-w-xs"
            value={setting.groupBy}
            onChange={(e) => onChange({ groupBy: e.target.value })}
          >
            {Object.values(GroupBy).map((value) => (
              <option
                key={value}
                value={value}
                disabled={setting.groupBy === value}
              >
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="divider"></div>
      <button className="btn" onClick={() => onChange(DEFAULT_PHOTOS_LAYOUT)}>
        Reset to default
      </button>
    </aside>
  );
}
