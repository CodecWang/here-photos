import { PhotoDTO, PhotoReadQueryDTO } from '@here-photos/dto';
import { DateTime } from 'luxon';

import { utc2cst } from '../utils/utc-convert';

export const PhotoService = {
  async sortAndGroupPhotos(photos: PhotoDTO[], options: PhotoReadQueryDTO) {
    const { timeline, order } = options;
    const formatMap = {
      none: '',
      year: 'yyyy',
      month: 'yyyy-MM',
      day: 'yyyy-MM-dd',
    } as const;
    const format = formatMap[timeline as keyof typeof formatMap] ?? 'yyyy-MM';
    const groupMap = new Map<string, PhotoDTO[]>();

    for (const photo of photos) {
      const localTime = utc2cst(photo.birthTime);
      if (!localTime) continue;

      const key = localTime.toFormat(format);
      const group = groupMap.get(key);
      const data = {
        ...photo,
        birthTime: localTime.toISO(),
      };

      if (group) group.push(data);
      else groupMap.set(key, [data]);
    }

    const groups = [...groupMap.entries()]
      .sort(([a], [b]) => {
        const dtA = DateTime.fromFormat(a, format);
        const dtB = DateTime.fromFormat(b, format);
        return order === 'desc'
          ? dtB.toMillis() - dtA.toMillis()
          : dtA.toMillis() - dtB.toMillis();
      })
      .map(([title, photos]) => ({ title, photos }));

    return groups;
  },
};
