'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import PageHeader from '~/components/page-header';
import { request } from '~/utils/request';

import Apperence from './components/apperence';
import ScanDirectories from './components/scan-directories';

interface Settings {
  photoDirs: string[];
}

export default function Page() {
  const t = useTranslations();
  const [settings, setSettings] = useState<Settings>({ photoDirs: [] });

  useEffect(() => {
    (async () => {
      const settings = await request('/api/v1/settings');
      if (settings) {
        setSettings(settings);
      }
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
    <div
      className="absolute inset-0 overflow-x-hidden overflow-y-auto transition-all duration-500"
      style={{
        animation: 'button-pop var(--animation-btn, 0.25s) ease-out',
      }}
    >
      <PageHeader title={t('setting.title')}></PageHeader>

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
