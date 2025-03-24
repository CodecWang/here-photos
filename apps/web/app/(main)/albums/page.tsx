'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import PageHeader from '~/components/page-header';
import { CACHE_KEY } from '~/config/constants';
import { GroupAlbumsBy } from '~/config/enums';
import CreateNewFolderIcon from '~/icons/create-new-folder-icon';
import { request } from '~/utils/request';

import Album from './components/album';
import AlbumGroup from './components/album-group';
import CreateAlbumModal from './components/create-album-modal';
import { GroupAlbumsDropdown } from './components/group-albums-dropdown';
import { groupAlbumsByYear } from './utils';

export default function Page() {
  const t = useTranslations();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [pinnedAlbums, setPinnedAlbums] = useState<Album[]>([]);
  const [albumGroups, setAlbumGroups] = useState<AlbumGroup[]>([]);
  const [groupBy, setGroupBy] = useState<GroupAlbumsBy>(GroupAlbumsBy.Year);

  useEffect(() => {
    (async () => {
      const albums = await request('/api/v1/albums');
      albums && setAlbums(albums.data);
    })();

    const cachedGroupBy = localStorage.getItem(CACHE_KEY.groupAlbumsBy);
    cachedGroupBy && setGroupBy(cachedGroupBy as GroupAlbumsBy);
  }, []);

  useEffect(() => {
    if (!albums.length) return;

    const pinned = albums.filter((album) => album.pinned);
    console.log('>>>', pinned);

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
    localStorage.setItem(CACHE_KEY.groupAlbumsBy, groupBy);
  };

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden transition-all duration-500">
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
                  'create-album-modal',
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
          <div className="bg-base-300 rounded-box flex space-x-2 overflow-hidden overflow-x-scroll p-4">
            {pinnedAlbums.map((album) => (
              <Album key={album.id} album={album} />
            ))}
          </div>
        )}

        {albumGroups.map((group, index) => (
          <AlbumGroup
            key={index}
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
