'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

export default function Welcome() {
  const { setTheme } = useTheme();

  const router = useRouter();

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden transition-all duration-500">
      <div className="flex min-h-screen items-center justify-center">
        <div>
          <h1 className="text-2xl">Welcome to</h1>
          <h2 className="text-4xl font-extrabold">Here Photos</h2>
          <h3 className="text-sm text-gray-500">
            Manage your photos with Microsoft AI
          </h3>

          <div className="mt-4 space-x-2">
            <button
              className="btn btn-sm btn-neutral"
              onClick={() => setTheme('light')}
            >
              Light
            </button>
            <button
              className="btn btn-sm btn-neutral"
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
            <button
              className="btn btn-sm btn-neutral"
              onClick={() => setTheme('system')}
            >
              System
            </button>
          </div>
          <button
            className="btn btn-primary mt-2 w-52 text-xl"
            onClick={() => router.push('/photos')}
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
}
