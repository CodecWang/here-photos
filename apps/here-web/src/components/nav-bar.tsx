import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import PhotoIcon from '~/icons/photo-icon';
import SearchIcon from '~/icons/search-icon';
import { cn } from '~/lib/utils';

import { IconButton } from './icon-button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';

export default function NavBar() {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <div className="absolute bottom-0 flex w-full flex-col items-center">
      <NavigationMenu className="mb-4 shadow-2xl ar-wrap">
        <NavigationMenuList>
          <NavigationMenuItem defaultChecked={true} className="flex">
            <NavigationMenuLink
              asChild
              active
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === '/photos' ? 'bg-secondary' : 'bg-transparent',
                'rounded-full'
              )}
            >
              <Link href="/photos">
                <PhotoIcon className="hidden lg:block size-4" />
                {t('nav.photos')}
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === '/albums' ? 'bg-secondary' : 'bg-transparent',
                'rounded-full'
              )}
            >
              <Link href="/albums">{t('nav.albums')}</Link>
            </NavigationMenuLink>
            <NavigationMenuLink
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                'rounded-full bg-transparent'
              )}
            >
              <IconButton
                icon={<SearchIcon />}
                aria-label={t('action.search')}
                tooltipContent={t('action.search')}
              />
            </NavigationMenuLink>
            <NavigationMenuLink
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === '/explore' ? 'bg-secondary' : 'bg-transparent',
                'rounded-full'
              )}
            >
              <Link href="/explore">{t('nav.explore')}</Link>
            </NavigationMenuLink>
            <NavigationMenuLink
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === '/my' ? 'bg-secondary' : 'bg-transparent',
                'rounded-full'
              )}
            >
              <Link href="/my">{t('nav.my')}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
