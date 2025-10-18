import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import {
  AlbumsLayoutSchema,
  AlbumsLayoutType,
  PhotosLayoutSchema,
  PhotosLayoutType,
} from '~/schemas';

import type { AlbumGroupDTO, PhotoDTO } from '@here-photos/dto';

export const selectedPhotoIdsAtom = atom<Set<string>>(new Set<string>());

export const navModeAtom = atomWithStorage('nav-mode', 0);

export const photosLayoutAtom = atomWithStorage<PhotosLayoutType>(
  'photos-layout',
  PhotosLayoutSchema.parse({})
);

export const photosAtom = atom<PhotoDTO[]>([]);

// TODO(arthur): need to be page specific atoms
export const albumGroupsAtom = atom<AlbumGroupDTO[]>([]);

export const albumActionsAtom = atom(
  null,
  (get, set, action: { type: string; payload?: any }) => {
    const groups = get(albumGroupsAtom);

    switch (action.type) {
      case 'togglePinned':
        set(
          albumGroupsAtom,
          groups.map((group) => ({
            ...group,
            albums: group.albums.map((a) =>
              a.albumId === action.payload.albumId
                ? { ...a, pinned: !a.pinned }
                : a
            ),
          }))
        );
        break;

      case 'rename':
        set(
          albumGroupsAtom,
          groups.map((group) => ({
            ...group,
            albums: group.albums.map((a) =>
              a.albumId === action.payload.albumId
                ? { ...a, name: action.payload.name }
                : a
            ),
          }))
        );
        break;

      case 'delete':
        set(
          albumGroupsAtom,
          groups
            .map((group) => ({
              ...group,
              albums: group.albums.filter(
                (a) => a.albumId !== action.payload.albumId
              ),
            }))
            .filter((group) => group.albums.length > 0)
        );
        break;

      default:
        break;
    }
  }
);

export const albumsLayoutAtom = atomWithStorage<AlbumsLayoutType>(
  'albums-layout',
  AlbumsLayoutSchema.parse({})
);
