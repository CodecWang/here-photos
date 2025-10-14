import { DateTimeFormatOptions, useFormatter } from 'next-intl';

/** Format a date time to a specific locale format */
export function useLocaleDate() {
  const format = useFormatter();

  return {
    formatDate: (date: string | Date | null | number) => {
      if (!date) return '';
      const options = getDateFormat(date);
      return format.dateTime(new Date(date), options);
    },
  };
}

/**
 * year: 'yyyy'
 * month: 'yyyy-MM'
 * day: 'yyyy-MM-dd'
 */
function getDateFormat(
  date: string | Date | null | number
): DateTimeFormatOptions {
  if (typeof date === 'string') {
    if (/^\d{4}$/.test(date)) {
      return { year: 'numeric' };
    }
    if (/^\d{4}-\d{2}$/.test(date)) {
      return { year: 'numeric', month: 'short' };
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { year: 'numeric', month: 'short', day: 'numeric' };
    }
  }

  return { year: 'numeric', month: 'short', day: 'numeric' };
}
