import { useAtom, useSetAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { morpherActionAtom, photosLayoutAtom } from '~/atoms';
import ArrowBackIcon from '~/icons/arrow-back-icon';
import CloseIcon from '~/icons/close-icon';
import Dashboard from '~/icons/dashboard';
import GridView from '~/icons/grid-view';
import { cn } from '~/lib/utils';
import {
  GalleryArrange,
  PhotosLayoutSchema,
  PhotosLayoutType,
  SortOrder,
  TimelineGroup,
} from '~/schemas';

import { IconButton } from '../icon-button';
import RangeWithButtons from '../range-with-buttons';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Slider } from '../ui/slider';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

export default function MorPherPhotosLayout() {
  const t = useTranslations();
  const setMorpherAction = useSetAtom(morpherActionAtom);
  const [photosLayout, setPhotosLayout] = useAtom(photosLayoutAtom);

  const onLayoutChange = useCallback((newView: Partial<PhotosLayoutType>) => {
    setPhotosLayout((prev) => {
      const newLayout = { ...prev, ...newView };
      return newLayout;
    });
  }, []);

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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="m-auto mt-2 flex flex-wrap space-x-4">
                {Object.values(GalleryArrange).map((arrange) => (
                  <button
                    key={arrange}
                    className={cn(
                      'btn flex flex-row',
                      photosLayout.arrange === arrange && 'btn-primary'
                    )}
                    name="options"
                    disabled={arrange === GalleryArrange.Masonry}
                    onClick={() => onLayoutChange({ arrange })}
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
                onChange={(value) => onLayoutChange({ size: value })}
              />
            </div>
            <div className="space-y-2">
              <span className="block">{t('photos.spacing')}</span>
              <RangeWithButtons
                min={0}
                max={24}
                value={photosLayout.spacing}
                onChange={(v) => onLayoutChange({ spacing: v })}
              />
            </div>
            <div className="space-y-2">
              <span className="block">{t('photos.cornerRadius')}</span>
              <div className="w-full max-w-xs">
                <Slider
                  value={[photosLayout.roundedCorner]}
                  max={70}
                  min={0}
                  step={10}
                  onValueChange={(v) => onLayoutChange({ roundedCorner: v[0] })}
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
          </div>

          <div className="space-y-2">
            <span className="block">排序和分组</span>
            <div className="flex space-x-2 items-center">
              <RadioGroup
                value={photosLayout.sortOrder}
                className="flex"
                onValueChange={(v) => {
                  onLayoutChange({
                    sortOrder: v as PhotosLayoutType['sortOrder'],
                  });
                  console.log(v);
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={SortOrder.Asc} id="option-one" />
                  <Label htmlFor="option-one">拍摄时间</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={SortOrder.Desc} id="option-two" />
                  <Label htmlFor="option-two">添加时间</Label>
                </div>
              </RadioGroup>

              <ToggleGroup
                variant="outline"
                type="single"
                value={photosLayout.sortOrder}
                onValueChange={(v) => {
                  onLayoutChange({
                    sortOrder: v as PhotosLayoutType['sortOrder'],
                  });
                  console.log(v);
                }}
              >
                <ToggleGroupItem value={SortOrder.Desc}>
                  <ArrowBackIcon className="-rotate-90" />
                </ToggleGroupItem>
                <ToggleGroupItem value={SortOrder.Asc}>
                  <ArrowBackIcon className="rotate-90" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex items-center">
              <span>{t('photos.timeline')}</span>
              <Select
                value={photosLayout.timeline}
                onValueChange={(e) =>
                  onLayoutChange({ timeline: e as TimelineGroup })
                }
              >
                <SelectTrigger className="w-[90px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TimelineGroup.None}>
                    {t('photos.noTimeline')}
                  </SelectItem>
                  <SelectItem value={TimelineGroup.Year}>
                    {t('photos.TimelineByYear')}
                  </SelectItem>
                  <SelectItem value={TimelineGroup.Month}>
                    {t('photos.TimelineByMonth')}
                  </SelectItem>
                  <SelectItem value={TimelineGroup.Day}>
                    {t('photos.TimelineByDay')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="divider"></div>
          <Button onClick={() => onLayoutChange(PhotosLayoutSchema.parse({}))}>
            {t('photos.resetToDefault')}
          </Button>
        </div>
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
