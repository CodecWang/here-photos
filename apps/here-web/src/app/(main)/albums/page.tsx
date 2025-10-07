'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import PageHeader from '~/components/page-header';
import { GroupAlbumsBy } from '~/config/enums';
import CreateNewFolderIcon from '~/icons/create-new-folder-icon';
import { request } from '~/utils/request';

import AlbumUI from './components/album';
import AlbumGroup from './components/album-group';
import CreateAlbumModal from './components/create-album-modal';
import { GroupAlbumsDropdown } from './components/group-albums-dropdown';
import { groupAlbumsByYear } from './utils';

import type { Album } from '@here-photos/db';

export default function Page() {
  const t = useTranslations();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [pinnedAlbums, setPinnedAlbums] = useState<Album[]>([]);
  const [albumGroups, setAlbumGroups] = useState<AlbumGroup[]>([]);
  const [groupBy, setGroupBy] = useState<GroupAlbumsBy>(GroupAlbumsBy.None);

  useEffect(() => {
    (async () => {
      const albums = await request<Album[]>('/api/v1/albums');
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
    <div className="absolute inset-0 overflow-x-hidden overflow-y-auto transition-all duration-500">
      <PageHeader title={t('nav.albums')}>
        <div
          className="tooltip tooltip-bottom"
          data-tip={t('albums.createAlbum')}
        >
          <button
            className="btn btn-ghost"
            onClick={() => {
              (
                document.getElementById(
                  'create-album-modal'
                ) as HTMLDialogElement
              )?.showModal();
            }}
          >
            <CreateNewFolderIcon className="size-6 md:size-5" />
            <span className="hidden md:inline">{t('albums.createAlbum')}</span>
          </button>
        </div>

        <GroupAlbumsDropdown groupBy={groupBy} onChange={handleGroupByChange} />
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
                  <div key={album.id} className="flex-none w-32">
                    <AlbumUI
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

        {albumGroups.map((group) => (
          <AlbumGroup
            key={group.title}
            title={group.title}
            count={group.count}
            albums={group.albums}
          />
        ))}
      </div>

      <CreateAlbumModal />
    </div>
  );
}
