'use client';

import { NextIntlClientProvider } from 'next-intl';
import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext({
  locale: 'en',
  setLocale: (_locale: string) => {
    // Do nothing
  },
});

function getLocale() {
  if (typeof window !== 'undefined') {
    const locale = localStorage.getItem('locale');
    if (locale) return locale;
  }
  return 'en';
}

export const LanguageProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [locale, setLocaleState] = useState(getLocale());

  const setLocale = (locale: string) => {
    setLocaleState(locale);
    localStorage.setItem('locale', locale);
  };

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const messages = require(`../locales/${locale}.json`);

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
