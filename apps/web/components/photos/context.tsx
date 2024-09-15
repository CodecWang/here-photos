import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useState,
} from 'react';

const PhotosContext = createContext({
  currentPhoto: null,
  setCurrentPhoto: Dispatch<SetStateAction<null>>,
});

export const PhotosProvider = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const [currentPhoto, setCurrentPhoto] = useState(null);

  return (
    <PhotosContext.Provider value={{ currentPhoto, setCurrentPhoto }}>
      {children}
    </PhotosContext.Provider>
  );
};

export const usePhotos = () => useContext(PhotosContext);
