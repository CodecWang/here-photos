import { ThemeProvider } from 'next-themes';

import './global.css';
import { LanguageProvider } from './language-provider';

import type { PropsWithChildren } from 'react';

export const metadata = {
  title: 'Here Photos',
  description: 'Modern photo gallery powered by AI',
};

export default function RootLayout({ children }: PropsWithChildren) {
  // TODO(arthur): use dynamic lang, such as from cookie or headers(server side)
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
