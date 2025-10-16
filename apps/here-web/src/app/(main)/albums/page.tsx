'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import EmptyUI from '~/components/empty-ui';
import PageHeader from '~/components/page-header';
import { Button } from '~/components/ui/button';
import { GroupAlbumsBy } from '~/config/enums';
import { request } from '~/utils/request';

import Album from './components/album';
import AlbumGroup from './components/album-group';
import CreateAlbumModal from './components/create-album-modal';
import { GroupAlbumsDropdown } from './components/group-albums-dropdown';
import { groupAlbumsByYear } from './utils';

import type { AlbumWithPhotosCountDTO } from '@here-photos/dto';

export default function Page() {
  const t = useTranslations();
  const [albums, setAlbums] = useState<AlbumWithPhotosCountDTO[]>([]);
  const [pinnedAlbums, setPinnedAlbums] = useState<AlbumWithPhotosCountDTO[]>(
    []
  );
  const [albumGroups, setAlbumGroups] = useState<AlbumGroup[]>([]);
  const [groupBy, setGroupBy] = useState<GroupAlbumsBy>(GroupAlbumsBy.None);

  useEffect(() => {
    (async () => {
      const albums = await request<AlbumWithPhotosCountDTO[]>('/api/v1/albums');
      if (albums) {
        setAlbums(albums);
      }
    })();
  }, []);

  useEffect(() => {
    if (!albums.length) return;

    const pinned = albums.filter((album) => album.pinned);
    setPinnedAlbums(pinned);

    switch (groupBy) {
      case GroupAlbumsBy.None:
        setAlbumGroups([{ title: '', count: albums.length, albums }]);
        break;
      case GroupAlbumsBy.Year:
        {
          const albumGroups = groupAlbumsByYear(albums);
          setAlbumGroups(albumGroups);
        }
        break;
      case GroupAlbumsBy.Owner:
        break;
    }
  }, [albums, groupBy]);

  const handleGroupByChange = (groupBy: GroupAlbumsBy) => {
    setGroupBy(groupBy);
    // localStorage.setItem(CACHE_KEY.groupAlbumsBy, groupBy);
  };

  return (
    <div
      className="absolute inset-0 overflow-x-hidden overflow-y-auto transition-all duration-500 "
      id="test-page"
    >
      <PageHeader title={t('nav.albums')}>
        <div className="ar-wrap" data-tip={t('albums.createAlbum')}>
          <CreateAlbumModal />
        </div>

        {/* <GroupAlbumsDropdown groupBy={groupBy} onChange={handleGroupByChange} /> */}
      </PageHeader>

      <div className="space-y-6 p-4">
        {pinnedAlbums.length > 0 && (
          <>
            <div className="w-full border-b border-base-200 py-2">
              <span className="text-2xl font-bold">Pinned</span>
            </div>
            <div className="overflow-x-auto">
              <div className="flex gap-4 w-max">
                {pinnedAlbums.map((album) => (
                  <div key={album.albumId} className="flex-none w-32">
                    <Album
                      album={album}
                      showPhotosCount={false}
                      showPinButton={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {albums.length === 0 && (
          <EmptyUI
            title="No Albums Yet"
            description="You haven't created any albums yet. Get started by creating your first album."
            actions={
              <>
                <Button>{t('albums.createAlbum')}</Button>
              </>
            }
          />
        )}

        {albumGroups.map((group) => (
          <AlbumGroup
            key={group.title}
            title={group.title}
            count={group.count}
            albums={group.albums}
          />
        ))}
      </div>
    </div>
  );
}
