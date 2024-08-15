'use client';

import { useEffect, useState } from 'react';

import PageHeader from '@/components/page-header';
import { CACHE_KEY } from '@/config/constants';
import CreateNewFolderIcon from '@/icons/create-new-folder-icon';
import { GroupAlbumsBy } from '@/types/enums';

import AlbumGroup from './album-group';
import CreateAlbumModal from './components/create-album-modal';
import { GroupAlbumsDropdown } from './group-albums-dropdown';
import { groupAlbumsByYear } from './utils';

export default function Page() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumGroups, setAlbumGroups] = useState<AlbumGroup[]>([]);
  const [groupBy, setGroupBy] = useState<GroupAlbumsBy>(GroupAlbumsBy.None);

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/v1/albums`);
      const albums = await response.json();
      setAlbums(albums.data);
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

    console.log('>>> groupBy', albumGroups.length);
  }, [albums, groupBy]);

  const handleGroupByChange = (groupBy: GroupAlbumsBy) => {
    setGroupBy(groupBy);
    localStorage.setItem(CACHE_KEY.groupAlbumsBy, groupBy);
  };

  return (
    <div className="flex-grow overflow-auto">
      <PageHeader title="Albums">
        <div className="tooltip tooltip-bottom" data-tip="Create album">
          <button
            className="btn btn-ghost"
            onClick={() =>
              document.getElementById('create-album-modal').showModal()
            }
          >
            <CreateNewFolderIcon className="size-6 md:size-5" />
            <span className="hidden md:inline">Create album</span>
          </button>
        </div>

        <GroupAlbumsDropdown groupBy={groupBy} onChange={handleGroupByChange} />
      </PageHeader>

      <div className="space-y-6 px-4 pt-2">
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
