'use client';

import { useAtomValue } from 'jotai';
import { NextIntlClientProvider } from 'next-intl';

import { localeAtom } from '~/atoms/i18n';

export const LanguageProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const locale = useAtomValue(localeAtom);
  const messages = require(`../messages/${locale}.json`);
  const timeZone = 'Asia/Chongqing';

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
    >
      {children}
    </NextIntlClientProvider>
  );
};
