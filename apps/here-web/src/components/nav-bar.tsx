import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import SearchIcon from '~/icons/search-icon';

export default function NavBar() {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <div className="absolute bottom-0 flex w-full flex-col items-center transition-all">
      <nav
        className="ar-glass border bg-base-200 mb-4 rounded-full shadow-2xl"
        style={{
          animation: 'button-pop var(--animation-btn, 0.25s) ease-out',
        }}
      >
        <ul className="menu menu-horizontal flex items-center space-x-2">
          <li>
            <Link
              className={clsx(
                pathname.startsWith('/photos') && 'menu-active',
                'rounded-full'
              )}
              href="/photos"
            >
              {/* <PhotoIcon className="size-4" /> */}
              {t('nav.photos')}
            </Link>
          </li>
          <li>
            <Link
              className={clsx(
                pathname.startsWith('/albums') && 'menu-active',
                'rounded-full'
              )}
              href="/albums"
            >
              {/* <FolderOpenIcon className="size-4" /> */}
              {t('nav.albums')}
            </Link>
          </li>
          <li>
            <button className="btn btn-circle btn-ghost btn-sm">
              <SearchIcon className="size-5" />
            </button>
          </li>
          <li>
            <Link
              className={clsx(
                pathname.startsWith('/explore') && 'menu-active',
                'rounded-full'
              )}
              href="/explore"
            >
              {/* <GlobeAsiaAustraliaIcon className="size-4" /> */}
              {t('nav.explore')}
            </Link>
          </li>
          <li>
            <Link
              className={clsx(
                pathname.startsWith('/my') && 'menu-active',
                'rounded-full'
              )}
              href="/my"
            >
              {/* <UserIcon className="size-4" /> */}
              {t('nav.my')}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
