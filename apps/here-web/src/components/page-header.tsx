import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ArrowBackIcon from '~/icons/arrow-back-icon';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
  backTarget?: string;
  scrollContainer?: React.RefObject<HTMLElement>;
}

export default function PageHeader({
  title,
  children,
  backTarget,
  scrollContainer,
}: PageHeaderProps) {
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
      {backTarget && (
        <button
          className="btn btn-ghost btn-circle mr-1 -ml-2"
          onClick={() => router.push(backTarget)}
        >
          <ArrowBackIcon className="size-5" />
        </button>
      )}
      <span className="whitespace-nowrap sm:text-xl">{title}</span>

      <div className="ml-3 flex w-[calc(100%-120px)] flex-1 items-center justify-end">
        {children}
      </div>
    </header>
  );
}
