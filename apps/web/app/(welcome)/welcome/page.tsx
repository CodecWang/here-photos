'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function Welcome() {
  const { setTheme } = useTheme();

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden transition-all duration-500">
      <div className="flex min-h-screen items-center justify-center">
        <div>
          <h1 className="text-2xl">Welcome to</h1>
          <h2 className="text-4xl font-extrabold">Here Photos</h2>
          <h3 className="text-base-300 text-sm">
            Manage your photos with Microsoft AI
          </h3>

          <div className="mt-4 space-x-2">
            <button
              className="btn btn-sm btn-neutral"
              onClick={() => setTheme('light')}
            >
              light
            </button>
            <button
              className="btn btn-sm btn-neutral"
              onClick={() => setTheme('dark')}
            >
              dark
            </button>
            <button
              className="btn btn-sm btn-neutral"
              onClick={() => setTheme('system')}
            >
              system
            </button>
          </div>

          <button className="btn btn-primary mt-2 w-52 text-xl">
            <Link href="/photos">START</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
