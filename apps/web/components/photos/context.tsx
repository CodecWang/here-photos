import React from 'react';
import { createContext, ReactNode, useContext, useState } from 'react';

const PhotosContext = createContext({
  currentPhoto: null,
  setCurrentPhoto: (_photo: Photo) => {},
});

export const PhotosProvider = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);

  return (
    // @ts-expect-error expected
    <PhotosContext.Provider value={{ currentPhoto, setCurrentPhoto }}>
      {children}
    </PhotosContext.Provider>
  );
};

export const usePhotos = () => useContext(PhotosContext);
