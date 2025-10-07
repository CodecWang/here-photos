import { ThemeProvider } from 'next-themes';

import './global.css';

import { TooltipProvider } from '~/components/ui/tooltip';

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
