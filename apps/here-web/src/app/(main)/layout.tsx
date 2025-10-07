'use client';

import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

import { navModeAtom } from '~/atoms';
import Header from '~/components/header';
import NavBar from '~/components/nav-bar';
import SideNav from '~/components/side-nav';
import { Toaster } from '~/components/ui/sonner';

import type { PropsWithChildren } from 'react';

export default function MainLayout({ children }: PropsWithChildren) {
  const navMode = useAtomValue(navModeAtom);

  // Avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <main className="absolute h-full w-full overflow-hidden">
      {children}
      <NavBar />
      <Toaster position="top-center" />
    </main>
  );

  // if (navMode === 1) {
  //   return (
  //     <main className="absolute h-full w-full overflow-hidden">
  //       {children}
  //       <NavBar />
  //     </main>
  //   );
  // }

  // return (
  //   <div className="flex h-lvh flex-col">
  //     <Header />
  //     <main className="drawer lg:drawer-open bg-base-200 h-full flex-grow overflow-hidden pt-16">
  //       <input id="side-nav-drawer" type="checkbox" className="drawer-toggle" />
  //       <section className="drawer-content bg-base-100 sm:rounded-box relative overflow-hidden sm:mx-3 sm:mb-3 lg:ml-0">
  //         {children}
  //       </section>
  //       <SideNav />
  //     </main>
  //   </div>
  // );
}
