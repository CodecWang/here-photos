import path from 'path';

/** Efficiently keep only top-most parent directories */
export function filterTopDirs(dirs: string[]) {
  const uniqueDirectories = Array.from(new Set(dirs));
  return uniqueDirectories.filter((dir, _, arr) => {
    return !arr.some(
      (otherDir) => dir !== otherDir && dir.startsWith(otherDir + path.sep)
    );
  });
}
