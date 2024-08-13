import './globals.css';

import clsx from 'clsx';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Here photos',
  description: 'Your AI photo gallery',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={clsx(inter.className, 'h-full overflow-hidden')}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
