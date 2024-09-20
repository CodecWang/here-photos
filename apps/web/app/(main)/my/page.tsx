'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import PageHeader from '@/components/page-header';
import { request } from '@/utils/request';

import ScanDirectories from './components/scan-directories';
import Apperence from './components/appearance';

interface Settings {
  photoDirs: string[];
}

export default function Page() {
  const [settings, setSettings] = useState<Settings>({ photoDirs: [] });

  useEffect(() => {
    (async () => {
      const settings = await request('/api/v1/settings');
      settings && setSettings(settings.data);
    })();
  }, []);

  const updateSettings = async ({ photoDirs }: Settings) => {
    const newSettings = await request('/api/v1/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photoDirs }),
    });

    newSettings && setSettings(newSettings.data);
  };

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden transition-all duration-500">
      <PageHeader title="Settings"></PageHeader>

      <div className="flex flex-wrap space-x-2 px-4 pt-2">
        <Apperence />

        <ScanDirectories
          photoDirs={settings.photoDirs}
          onChange={(photoDirs) => updateSettings({ photoDirs })}
        />
      </div>
    </div>
  );
}
