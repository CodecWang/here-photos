'use client';

import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

import Album from './components/album';
import AlbumGroup from './components/album-group';
import CreateAlbumModal from './components/create-album-modal';

import type {
  AlbumDTO,
  AlbumGroupDTO,
  AlbumReadQueryDTO,
} from '@here-photos/dto';

import { albumGroupsAtom, albumsLayoutAtom } from '~/atoms';
import EmptyUI from '~/components/empty-ui';
import PageHeader from '~/components/page-header';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { REQUEST_DEBOUNCE_MS } from '~/config/constants';
import { AlbumsGroupBy } from '~/schemas';
import { makeParams } from '~/utils/params';
import { request } from '~/utils/request';

export default function Page() {
  const t = useTranslations();
  const [pinnedAlbums, setPinnedAlbums] = useState<AlbumDTO[]>([]);
  const [albumGroups, setAlbumGroups] = useAtom(albumGroupsAtom);
  const [albumsLayout, setAlbumsLayout] = useAtom(albumsLayoutAtom);

  const fetchAlbums = useCallback(async (options?: AlbumReadQueryDTO) => {
    const params = makeParams(options);
    const albumGroups = await request<AlbumGroupDTO[]>(
      `/api/v1/albums?${params}`
    );
    setAlbumGroups(albumGroups ?? []);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAlbums({
        groupBy: albumsLayout.groupBy,
      });
    }, REQUEST_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [albumsLayout.groupBy]);

  useEffect(() => {
    console.log('>>> albumGroups', albumGroups);
    const pinned = albumGroups
      ?.flatMap((group) => group.albums)
      .filter((album) => album.pinned);
    setPinnedAlbums(pinned ?? []);
  }, [albumGroups]);

  return (
    <div className="absolute inset-0 overflow-x-hidden overflow-y-auto transition-all duration-500">
      <PageHeader title={t('nav.albums')}>
        <div className="ar-wrap flex items-center">
          <CreateAlbumModal />

          <Select
            disabled={albumGroups.length === 0}
            onValueChange={(v) =>
              setAlbumsLayout({ ...albumsLayout, groupBy: v as AlbumsGroupBy })
            }
            value={albumsLayout.groupBy}
          >
            <SelectTrigger className="rounded-full space-x-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AlbumsGroupBy.None} className="flex">
                {t('albums.noGrouping')}
              </SelectItem>
              <SelectItem value={AlbumsGroupBy.Year}>
                {t('albums.groupByYear')}
              </SelectItem>
              <SelectItem value={AlbumsGroupBy.Owner} disabled>
                {t('albums.groupByOwner')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      <div className="space-y-6 p-4">
        {pinnedAlbums.length > 0 && (
          <>
            {/* <div className="w-full border-b border-base-200 py-2">
              <span className="text-2xl font-bold">Pinned</span>
            </div> */}
            <div className="overflow-x-auto bg-secondary p-4 rounded-lg">
              <div className="flex gap-4 w-max">
                {pinnedAlbums.map((album) => (
                  <div key={album.albumId} className="flex-none w-24">
                    <Album album={album} showCount={false} showTitle={false} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {albumGroups.length === 0 ? (
          <EmptyUI
            title="No Albums Yet"
            description="You haven't created any albums yet. Get started by creating your first album."
            actions={
              <>
                <Button>{t('albums.createAlbum')}</Button>
              </>
            }
          />
        ) : (
          albumGroups.map((group) => (
            <AlbumGroup
              key={group.title}
              title={group.title}
              count={group.albums.length}
              albums={group.albums}
            />
          ))
        )}
      </div>
    </div>
  );
}
