'use client';

import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import React from 'react';

import { selectedPhotoIdsAtom } from '~/atoms';
import { IconButton } from '~/components/icon-button';
import PageHeader from '~/components/page-header';
import Photos from '~/components/photos';
import PhotoActions from '~/components/photos/photo-actions';
import PhotosLayout from '~/components/photos/photos-layout';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { usePhotoGroups } from '~/hooks/use-photo-groups';
import AddPhotoAlternateIcon from '~/icons/add-photo-alternate-icon';
import MoreVertIcon from '~/icons/more-vert-icon';
import ShareIcon from '~/icons/share-icon';
import TuneIcon from '~/icons/tune-icon';
import { AlbumsGroupBy } from '~/schemas';
import { request } from '~/utils/request';

import DeleteAlbumModal from '../components/delete-album-modal';

import type { AlbumDTO } from '@here-photos/dto';

interface PageProps extends React.PropsWithChildren {
  params: Promise<{ albumId: string }>;
}

export default function Page({ params }: PageProps) {
  const t = useTranslations();
  const selectedPhotoIds = useAtomValue(selectedPhotoIdsAtom);

  const scrollRef = useRef<HTMLDivElement>(null);

  const { albumId } = React.use(params);
  const [album, setAlbum] = useState<AlbumDTO>();
  const { photoGroups } = usePhotoGroups({ albumId });
  const [subAlbum, setSubAlbum] = useState<string>('All');
  const [isOpenLayout, setIsOpenLayout] = useState(false);

  useEffect(() => {
    (async () => {
      const album = await request<AlbumDTO>(`/api/v1/albums/${albumId}`);
      if (!album) {
        // TODO(arthur): do nothing for now, unify not found/error handling/suspense boundaries later
        throw new Error('Failed to load album');
      }
      setAlbum(album);
    })();
  }, []);

  return (
    <>
      <div
        className={clsx(
          'absolute inset-0 overflow-y-auto overflow-x-hidden transition-all duration-500',
          isOpenLayout && 'sm:right-80'
        )}
        ref={scrollRef}
      >
        <PageHeader
          scrollContainer={scrollRef}
          title={album?.title ?? ''}
          backTarget="/albums"
          // titleActions={
          //   <div className="backdrop-blur-md bg-background/60 rounded-full">
          //     <Select value={subAlbum} onValueChange={setSubAlbum}>
          //       <SelectTrigger className="rounded-full space-x-1 border-white/20">
          //         <SelectValue />
          //       </SelectTrigger>
          //       <SelectContent>
          //         <SelectItem value={'All'} className="flex">
          //           所有照片
          //         </SelectItem>
          //         <SelectItem value={'渔山岛'}>渔山岛 day1</SelectItem>
          //         <SelectItem value={'鼓浪屿'}>厦门鼓浪屿 day2</SelectItem>
          //         <SelectItem value={'神仙居'}>台州神仙居 day3</SelectItem>
          //         <SelectItem value={'百丈漈'}>温州百丈漈 day4</SelectItem>
          //         <SelectItem value={'天平山'}>苏州天平山 day5</SelectItem>
          //       </SelectContent>
          //     </Select>
          //   </div>
          // }
        >
          {selectedPhotoIds.size === 0 && (
            <div className="ar-wrap flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full bg-transparent"
                    // onClick={() => setOpen(true)}
                  >
                    <AddPhotoAlternateIcon />
                    <span className="hidden md:inline">
                      {t('albums.addPhotos')}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent> {t('albums.addPhotos')}</TooltipContent>
              </Tooltip>
              <IconButton
                aria-label={t('action.share')}
                disabled={photoGroups.length === 0}
                tooltipContent={t('action.share')}
                icon={<ShareIcon />}
              />
              <IconButton
                active={isOpenLayout}
                icon={<TuneIcon />}
                aria-label={t('photos.layoutTip')}
                disabled={photoGroups.length === 0}
                tooltipContent={t('photos.layoutTip')}
                onClick={() => setIsOpenLayout((prev) => !prev)}
              />
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <IconButton
                    icon={<MoreVertIcon />}
                    aria-label={t('action.more')}
                    tooltipContent={t('action.more')}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>fs</DropdownMenuItem>
                  <DropdownMenuItem>{t('action.rename')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('action.share')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('action.delete')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {selectedPhotoIds.size > 0 && <PhotoActions />}
        </PageHeader>
        <div className="pt-2">
          <Photos data={photoGroups} albumId={albumId} />
        </div>
      </div>

      <PhotosLayout
        open={isOpenLayout}
        onClose={() => setIsOpenLayout(false)}
      />

      {/* <DeleteAlbumModal album={album} /> */}
    </>
  );
}
