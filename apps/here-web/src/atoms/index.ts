import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { PhotosLayoutSchema, PhotosLayoutType, PhotoUIType } from '~/schemas';

export const selectedPhotoIdsAtom = atom<Set<string>>(new Set<string>());

export const navModeAtom = atomWithStorage('nav-mode', 0);

export const photosLayoutAtom = atomWithStorage<PhotosLayoutType>(
  'photos-layout',
  PhotosLayoutSchema.parse({})
);

export const photosAtom = atom<PhotoUIType[]>([]);
