import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import ArrowBackIcon from '~/icons/arrow-back-icon';

import { IconButton } from './icon-button';

interface PageHeaderProps {
  title: string;
  backTarget?: string;
  children?: React.ReactNode;
  titleActions?: React.ReactNode;
  scrollContainer?: React.RefObject<HTMLElement>;
}

export default function PageHeader({
  title,
  children,
  titleActions,
  backTarget,
  scrollContainer,
}: PageHeaderProps) {
  const t = useTranslations();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      let scrolled = false;

      if (scrollContainer) {
        scrolled = scrollContainer.current.scrollTop > 0;
      } else {
        // Fallback to window scroll
        scrolled = window.scrollY > 0;
      }

      setIsScrolled(scrolled);
    };

    let targetElement: Element | Window = window;

    if (scrollContainer) {
      targetElement = scrollContainer.current;
    }

    targetElement.addEventListener('scroll', handleScroll);
    return () => targetElement.removeEventListener('scroll', handleScroll);
  }, [scrollContainer]);

  return (
    <header
      className={`sticky top-0 z-10 flex h-14 w-full items-center px-4 py-2 transition-all duration-200 ${
        isScrolled
          ? 'bg-gradient-to-b from-background/40 to-transparent'
          : 'bg-transparent'
      }`}
    >
      {/* <header className="ar-glass border-base-content/10 bg-base-100 bg-opacity-70 sticky top-0 z-10 flex h-14 w-full items-center px-4 py-2"> */}

      <div className="space-x-2 flex items-center">
        {backTarget && (
          <IconButton
            // active={true}
            icon={<ArrowBackIcon />}
            aria-label={t('nav.back')}
            tooltipContent={t('nav.back')}
            onClick={() => router.push(backTarget)}
          />
        )}
        <span className="whitespace-nowrap sm:text-xl">{title}</span>
        {titleActions}
      </div>

      <div className="ml-3 flex w-[calc(100%-120px)] flex-1 items-center justify-end">
        {children}
      </div>
    </header>
  );
}
