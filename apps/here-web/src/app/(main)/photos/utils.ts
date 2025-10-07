import { PhotoUIType, TimelineGroup } from '~/schemas';

export function groupPhotosByDate(
  photos: PhotoUIType[],
  timeline: TimelineGroup,
  locale = 'en-US'
) {
  console.log('>>> groupPhotosByDate called with timeline:', timeline);
  if (!timeline || timeline === TimelineGroup.None) {
    return [{ photos, title: '' }];
  }

  const optionsMap: { [key in TimelineGroup]?: Intl.DateTimeFormatOptions } = {
    [TimelineGroup.Year]: { year: 'numeric' },
    [TimelineGroup.Month]: { year: 'numeric', month: 'short' },
    [TimelineGroup.Day]: {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  };

  const options = optionsMap[timeline];
  console.log('Grouping photos with options:', options);
  const groupedPhotos = photos.reduce(
    (acc: { [key: string]: PhotoUIType[] }, photo) => {
      const date = new Date(photo.birthTime).toLocaleDateString(
        locale,
        options
      );

      if (!acc[date]) acc[date] = [];
      acc[date].push(photo);
      return acc;
    },
    {}
  );

  return Object.entries(groupedPhotos).map(([date, photos]) => ({
    photos,
    title: date,
  }));
}
