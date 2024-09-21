import { createContext, ReactNode, useContext, useState } from 'react';

import Header from '@/components/header';
import NavBar from '@/components/nav-bar';
import SideNav from '@/components/side-nav';
import { CACHE_KEY, DEFAULT_NAV_MODE } from '@/config/constants';
import { NavMode } from '@/config/enums';

const defaultContext = {
  navMode: NavMode.Modern,
  setNavMode: (_mode: NavMode) => {},
};
const NavContext = createContext(defaultContext);

function getNavMode() {
  if (typeof window !== 'undefined') {
    const mode = localStorage.getItem(CACHE_KEY.navMode);
    if (mode) return parseInt(mode);
  }
  return DEFAULT_NAV_MODE;
}

export const NavProvider = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const [navMode, setNavModeState] = useState(getNavMode());

  const setNavMode = (mode: NavMode) => {
    setNavModeState(mode);
    localStorage.setItem(CACHE_KEY.navMode, mode.toString());
  };

  const providerValue = {
    navMode,
    setNavMode,
  };

  const ModernLayout = () => {
    return (
      <main className="absolute flex h-full w-full overflow-hidden">
        {children}
        <NavBar />
      </main>
    );
  };

  const TraditionalLayout = () => {
    return (
      <div className="flex h-lvh flex-col">
        <Header />
        <main className="drawer lg:drawer-open bg-base-200 h-full flex-grow overflow-hidden pt-16">
          <input
            id="side-nav-drawer"
            type="checkbox"
            className="drawer-toggle"
          />
          <section className="drawer-content bg-base-100 sm:rounded-box relative overflow-hidden sm:mx-3 sm:mb-3 lg:ml-0">
            {children}
          </section>
          <SideNav />
        </main>
      </div>
    );
  };

  return (
    <NavContext.Provider value={providerValue}>
      {navMode === NavMode.Modern ? <ModernLayout /> : <TraditionalLayout />}
    </NavContext.Provider>
  );
};

export const useNavMode = () => useContext(NavContext);
