import { GroupBy } from '@/types/enums';
import { Photo } from '@/type';

export function groupPhotoByDate(photos: Photo[], groupBy?: GroupBy) {
  if (!groupBy || groupBy === GroupBy.None) {
    return [{ photos, title: '' }];
  }

  const optionsMap: { [key in GroupBy]?: Intl.DateTimeFormatOptions } = {
    [GroupBy.Year]: { year: 'numeric' },
    [GroupBy.Month]: { year: 'numeric', month: 'short' },
    [GroupBy.Day]: {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  };

  const options = optionsMap[groupBy];
  const groupedPhotos = photos.reduce(
    (acc: { [key: string]: Photo[] }, photo) => {
      const date = new Date(photo.shotTime).toLocaleDateString(
        'en-US',
        options,
      );

      if (!acc[date]) acc[date] = [];
      acc[date].push(photo);
      return acc;
    },
    {},
  );

  return Object.entries(groupedPhotos)
    .map(([date, photos]) => ({
      photos,
      title: date,
    }))
    .splice(0, 2);
}
