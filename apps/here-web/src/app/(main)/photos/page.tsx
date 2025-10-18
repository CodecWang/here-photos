'use client';

import { PhotoGroupDTO, PhotoReadQueryDTO } from '@here-photos/dto';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { selectedPhotoIdsAtom } from '~/atoms';
import { IconButton } from '~/components/icon-button';
import PageHeader from '~/components/page-header';
import Photos from '~/components/photos';
import PhotoActions from '~/components/photos/photo-actions';
import PhotosFilter from '~/components/photos/photos-filter';
import PhotosLayout from '~/components/photos/photos-layout';
import { Button } from '~/components/ui/button';
import { Spinner } from '~/components/ui/spinner';
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group';
import Upload from '~/components/upload';
import { usePhotoGroups } from '~/hooks/use-photo-groups';
import FilterAltIcon from '~/icons/filter-alt-icon';
import TuneIcon from '~/icons/tune-icon';

type PanelType = 'layout' | 'filter' | null;

export default function Page() {
  const t = useTranslations();
  const selectedPhotoIds = useAtomValue(selectedPhotoIdsAtom);

  const [hasLoaded, setHasLoaded] = useState(true);
  const [keyword, setKeyword] = useState<string>();
  const [openPanel, setOpenPanel] = useState<PanelType>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const { photoGroups, loading } = usePhotoGroups();

  const togglePanel = (panel: PanelType) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  return (
    <>
      <div
        className={clsx(
          'absolute inset-0 overflow-x-hidden overflow-y-auto transition-all duration-500',
          openPanel !== null && 'sm:right-80'
        )}
        ref={scrollRef}
      >
        <PageHeader title={t('nav.photos')} scrollContainer={scrollRef}>
          {photoGroups.length > 0 && selectedPhotoIds.size === 0 && (
            <ToggleGroup
              type="single"
              className="m-auto ar-wrap hidden sm:flex"
              onValueChange={setKeyword}
              value={keyword}
            >
              <ToggleGroupItem value="旅行" className="rounded-full">
                Travel
              </ToggleGroupItem>
              <ToggleGroupItem value="摄影" className="rounded-full">
                Photography
              </ToggleGroupItem>
              <ToggleGroupItem value="宠物" className="rounded-full">
                Pets
              </ToggleGroupItem>
              <ToggleGroupItem value="家庭" className="rounded-full">
                Family
              </ToggleGroupItem>
              <ToggleGroupItem value="美食" className="rounded-full">
                Food
              </ToggleGroupItem>
            </ToggleGroup>
          )}

          {selectedPhotoIds.size === 0 && (
            <div className="whitespace-nowrap flex items-center space-x-1 ar-wrap">
              <Upload
                disabled={loading}
                className="rounded-full bg-transparent"
              />
              <IconButton
                active={openPanel === 'layout'}
                icon={<TuneIcon />}
                aria-label={t('photos.layoutTip')}
                disabled={photoGroups.length === 0}
                tooltipContent={t('photos.layoutTip')}
                onClick={() => togglePanel('layout')}
              />
              <IconButton
                active={openPanel === 'filter'}
                icon={<FilterAltIcon />}
                aria-label={t('photos.filterTip')}
                disabled={photoGroups.length === 0}
                tooltipContent={t('photos.filterTip')}
                onClick={() => togglePanel('filter')}
              />
            </div>
          )}

          {selectedPhotoIds.size > 0 && (
            <PhotoActions />
            // <PhotoActions onDelete={() => fetchPhotos()} />
          )}
        </PageHeader>

        <div className="pt-2">
          {!hasLoaded && <Spinner />}
          {hasLoaded && loading && <Spinner />}
          {hasLoaded && !loading && (
            <Photos
              data={photoGroups}
              emptyActions={
                <>
                  <Button>{t('action.scan')}</Button>
                  <Upload variant="outline" />
                </>
              }
            />
          )}
        </div>
      </div>

      <PhotosLayout
        open={openPanel === 'layout'}
        onClose={() => setOpenPanel(null)}
      />

      <PhotosFilter
        open={openPanel === 'filter'}
        onChange={() => {
          // do nothing
        }}
        onClose={() => setOpenPanel(null)}
      />
    </>
  );
}
