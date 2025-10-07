import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import DeleteIcon from '~/icons/delete-icon';
import FavoriteIcon from '~/icons/favorite-icon';
import ImageSearchIcon from '~/icons/image-search-icon';
import MapIcon from '~/icons/map-icon';
import PersonSearchIcon from '~/icons/person-search-icon';
import PhotoAlbumIcon from '~/icons/photo-album-icon';
import PhotoIcon from '~/icons/photo-icon';
import ShareIcon from '~/icons/share-icon';

export default function SideNav() {
  const t = useTranslations();
  const pathname = usePathname();

  const menu = [
    {
      title: t('nav.photos'),
      icon: PhotoIcon,
      href: '/photos',
    },
    {
      title: t('nav.explore'),
      icon: ImageSearchIcon,
      href: '/explore',
    },
    {
      title: t('nav.my'),
      icon: ShareIcon,
      href: '/my',
    },
    {
      isDivider: true,
    },
    {
      title: t('nav.albums'),
      icon: PhotoAlbumIcon,
      href: '/albums',
    },
    {
      title: t('nav.people'),
      icon: PersonSearchIcon,
      href: '/people',
    },
    {
      title: t('nav.places'),
      icon: MapIcon,
      href: '/places',
    },
    {
      title: t('nav.favorites'),
      icon: FavoriteIcon,
      href: '/favorites',
    },
    {
      title: t('nav.trash'),
      icon: DeleteIcon,
      href: '/trash',
    },
  ];

  return (
    <aside className="drawer-side z-20 h-full">
      <label
        htmlFor="side-nav-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <ul className="menu bg-base-200 h-full w-64 overflow-auto px-3">
        <ul
          className="menu menu-lg w-56"
          onClick={() => {
            const sideNavLabel = document.getElementById('side-nav-drawer');
            sideNavLabel &&
              ((sideNavLabel as HTMLInputElement).checked = false);
          }}
        >
          {menu.map((item) =>
            item.isDivider ? (
              <li key={item.title} className="menu-title">
                LIBRARY
              </li>
            ) : (
              <li key={item.title}>
                <Link
                  className={clsx(
                    'rounded-full text-sm leading-6',
                    pathname.startsWith(item.href ?? '') && 'active'
                  )}
                  href={item.href ?? ''}
                >
                  {item.icon && <item.icon className="size-6" />}
                  <span className="pl-2">{item.title}</span>
                </Link>
              </li>
            )
          )}
        </ul>
      </ul>
    </aside>
  );
}
