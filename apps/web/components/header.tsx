import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

import { NavMode } from '@/config/enums';
import DarkModeIcon from '@/icons/dark-mode-icon';
import LightModeIcon from '@/icons/light-mode-icon';
import MenuIcon from '@/icons/menu-icon';
import SearchIcon from '@/icons/search-icon';
import SelfImprovementIcon from '@/icons/self-improvement-icon';

import { useNavMode } from '../app/(main)/nav-provider';
import IconButton from './ui/icon-button';
import Upload from './upload';

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { navMode, setNavMode } = useNavMode();
  const router = useRouter();

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (pathname.startsWith('/search')) {
        router.replace(`/search?q=${e.currentTarget.value}`);
      } else {
        router.push(`/search?q=${e.currentTarget.value}`);
      }
    }
  };

  return (
    <header className="text-base-content bg-base-200 fixed top-0 z-20 flex h-16 w-full justify-center">
      <nav className="navbar w-full">
        <div className="flex-none">
          <label
            htmlFor="side-nav-drawer"
            className="btn btn-square btn-ghost drawer-button lg:hidden"
          >
            <MenuIcon className="size-6" />
          </label>
        </div>
        <div className="flex-none md:w-60 lg:ml-4">
          <a className="text-xl">Here Photos</a>
        </div>

        <div className="flex flex-1">
          <label className="input hidden flex-1 items-center gap-2 rounded-full md:flex md:max-w-[500px]">
            <SearchIcon className="size-5" />
            <input
              type="text"
              className="grow"
              placeholder="Try search with natural language"
              onKeyDown={handleKeydown}
            />
            <span className="opacity-50 rtl:flex-row-reverse">
              <kbd className="kbd kbd-sm">⌘</kbd>
              <kbd className="kbd kbd-sm">k</kbd>
            </span>
          </label>
        </div>

        <div className="flex-none">
          <IconButton
            className="md:hidden"
            tooltip="Search"
            icon={<SearchIcon className="size-6" />}
          />
          <Upload />

          <IconButton
            tooltip={navMode === NavMode.Modern ? 'Nav Mode' : 'Zen mode'}
            onClick={() => setNavMode(NavMode.Modern)}
            icon={<SelfImprovementIcon className="size-6" />}
          />

          <IconButton
            tooltip={theme === 'dark' ? 'Light' : 'Dark'}
            icon={
              <label className="swap swap-rotate">
                <input
                  type="checkbox"
                  className="theme-controller"
                  checked={theme !== 'dark'}
                  onChange={(e) =>
                    setTheme(e.target.checked ? 'light' : 'dark')
                  }
                />
                <LightModeIcon className="swap-off size-6" />
                <DarkModeIcon className="swap-on size-6" />
              </label>
            }
          />
          {/* <button className="btn btn-circle">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
          </button> */}
        </div>
      </nav>
    </header>
  );
}
