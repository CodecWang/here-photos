'use client';

import { useEffect, useState } from 'react';

import PageHeader from '@/components/page-header';
import { CACHE_KEY } from '@/config/constants';
import { GroupAlbumsBy } from '@/config/enums';
import CreateNewFolderIcon from '@/icons/create-new-folder-icon';
import { request } from '@/utils/request';

import AlbumGroup from './components/album-group';
import CreateAlbumModal from './components/create-album-modal';
import { GroupAlbumsDropdown } from './components/group-albums-dropdown';
import { groupAlbumsByYear } from './utils';

export default function Page() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumGroups, setAlbumGroups] = useState<AlbumGroup[]>([]);
  const [groupBy, setGroupBy] = useState<GroupAlbumsBy>(GroupAlbumsBy.None);

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
      <PageHeader title="Albums">
        <div className="tooltip tooltip-bottom" data-tip="Create album">
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
            <span className="hidden md:inline">Create album</span>
          </button>
        </div>

        <GroupAlbumsDropdown groupBy={groupBy} onChange={handleGroupByChange} />
      </PageHeader>

      <div className="space-y-6 p-4">
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
