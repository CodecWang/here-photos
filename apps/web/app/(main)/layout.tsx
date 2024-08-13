'use client';

import { ReactNode, useEffect, useState } from 'react';

import { NavProvider } from './nav-provider';

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient && <NavProvider>{children}</NavProvider>;
}
