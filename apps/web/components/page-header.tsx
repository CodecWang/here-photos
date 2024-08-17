import { useRouter } from 'next/navigation';

import ArrowBackIcon from '@/icons/arrow-back-icon';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
  backTarget?: string;
}

export default function PageHeader({
  title,
  children,
  backTarget,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="border-base-content/10 sticky top-0 z-10 flex h-14 w-full items-center border-b px-4 py-2 backdrop-blur">
      {backTarget && (
        <button
          className="btn btn-ghost btn-circle mr-1"
          onClick={() => router.push(backTarget)}
        >
          <ArrowBackIcon className="size-5" />
        </button>
      )}
      <span className="sm:text-xl">{title}</span>

      <div className="flex flex-1 items-center justify-end">{children}</div>
    </header>
  );
}
