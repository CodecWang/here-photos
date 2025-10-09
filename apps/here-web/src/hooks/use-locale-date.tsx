import { DateTimeFormatOptions, useFormatter } from 'next-intl';

/** Format a date time to a specific locale format */
export function useLocaleDate() {
  const format = useFormatter();

  return {
    formatDate: (
      date: string | Date | null | number,
      options: DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }
    ) => {
      if (!date) return '';
      return format.dateTime(new Date(date), options);
    },
  };
}
