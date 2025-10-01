import exifReader from 'exif-reader';

export async function readExif(exif?: Buffer) {
  const exifData = exif ? exifReader(exif) : null;

  // TODO(arthur): add most used exif fields and handle gps info
  return {
    shotTime: exifData?.Photo?.DateTimeOriginal,
    cameraMake: exifData?.Image?.Make,
    cameraModel: exifData?.Image?.Model,
    iso: exifData?.Photo?.ISOSpeedRatings,
    gpsLatitude: null,
    gpsLongitude: null,
  };
}
