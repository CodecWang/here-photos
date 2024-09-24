import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import SearchIcon from '@/icons/search-icon';

export default function NavBar() {
  const pathname = usePathname();
  return (
    <div className="absolute bottom-0 flex w-full flex-col items-center transition-all">
      <nav
        className="rounded-box bg-base-200 mb-4 shadow-2xl"
        style={{
          animation: 'button-pop var(--animation-btn, 0.25s) ease-out',
        }}
      >
        <ul className="menu menu-horizontal flex items-center space-x-2">
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
              className={clsx(pathname.startsWith('/explore') && 'active')}
              href="/explore"
            >
              {/* <GlobeAsiaAustraliaIcon className="size-4" /> */}
              Explore
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
