/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

interface PhotoGroupType {
  title: string;
  photos: PhotoType[];
}

interface AlbumGroup {
  title: string;
  count: number;
  albums: Album[];
}
