import { DateTime } from 'luxon';

export function utc2cst(
  utcDate: Date | string | null,
  tz = 'Asia/Shanghai'
): DateTime | null {
  if (!utcDate) return null;

  const iso = utcDate instanceof Date ? utcDate.toISOString() : utcDate;
  const dt = DateTime.fromISO(iso, { zone: 'utc' });
  return dt.isValid ? dt.setZone(tz) : null;
}
