import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const navModeAtom = atomWithStorage('nav-mode', 0);

export const photosAtom = atom<Photo[]>([]);
