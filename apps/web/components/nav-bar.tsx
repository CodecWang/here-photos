import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import SearchIcon from '@/icons/search-icon';

export default function NavBar() {
  const pathname = usePathname();
  return (
    <div className="absolute bottom-0 flex w-full flex-col items-center">
      <nav
        className="mb-4 rounded-box bg-base-200 shadow-2xl"
        style={{
          animation: 'button-pop var(--animation-btn, 0.25s) ease-out',
        }}
      >
        <ul className="menu menu-horizontal flex items-center">
          <li>
            <Link
              className={clsx(pathname.startsWith('/photos') && 'active')}
              href="/photos"
            >
              {/* <PhotoIcon className="size-4" /> */}
              Photos
            </Link>
          </li>
          <li>
            <Link
              className={clsx(pathname.startsWith('/albums') && 'active')}
              href="/albums"
            >
              {/* <FolderOpenIcon className="size-4" /> */}
              Albums
            </Link>
          </li>
          <li>
            <button className="btn btn-circle btn-ghost btn-sm">
              <SearchIcon className="size-5" />
            </button>
          </li>
          <li>
            <Link
              className={clsx(pathname.startsWith('/explorer') && 'active')}
              href="/explorer"
            >
              {/* <GlobeAsiaAustraliaIcon className="size-4" /> */}
              Explorer
            </Link>
          </li>
          <li>
            <Link
              className={clsx(pathname.startsWith('/my') && 'active')}
              href="/my"
            >
              {/* <UserIcon className="size-4" /> */}
              My
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
