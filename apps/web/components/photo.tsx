import { thumbHashToDataURL } from "@/utils/thumb-hash";
import Image from "next/image";
import { useState } from "react";
import { clsx } from "clsx";

interface PhotoProps {
  photo: any;
  width: number;
  height: number;
  top: number;
  left: number;
  // onClick: (photo: any) => void;
  // onSelect: (photo: any) => void;
}

export default function Photo(props: PhotoProps) {
  const { photo, width, height, top, left } = props;

  const [isLoaded, setIsLoaded] = useState(false);

  const blurDataURL = thumbHashToDataURL(Buffer.from(photo.blurHash, "base64"));

  return (
    <div className="absolute" style={{ top, left }}>
      <Image
        src={`/api/v1/photos/${photo.id}/thumbnail?variant=2`}
        width={width}
        height={height}
        alt=""
        placeholder="blur"
        blurDataURL={blurDataURL}
        // className={clsx(
        //   "transition-opacity duration-700 ease-in-out",
        //   isLoaded ? "opacity-100" : "opacity-50",
        // )}
        // onLoadingComplete={() => setIsLoaded(true)}
      />
    </div>
  );
}
