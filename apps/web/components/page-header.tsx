interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 w-full items-center border-b border-gray-300 px-4 py-2 backdrop-blur">
      <span className="sm:text-xl">{title}</span>

      <div className="flex flex-1 items-center justify-end">{children}</div>
    </header>
  );
}
