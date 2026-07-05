'use client';

import { SettingDTO } from '@here-photos/dto';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import Apperence from './components/apperence';
import ScanDirectories from './components/scan-directories';

import PageHeader from '~/components/page-header';
import { Button } from '~/components/ui/button';
import { request } from '~/utils/request';

export default function Page() {
  const t = useTranslations();
  const [settings, setSettings] = useState<SettingDTO>();

  useEffect(() => {
    (async () => {
      const settings = await request<SettingDTO>('/api/v1/settings');
      console.log('>>>> settings', settings);
      if (settings) {
        setSettings(settings);
      }
    })();
  }, []);

  // const updateSettings = async ({ photoDirs }: SettingDTO) => {
  //   const newSettings = await request('/api/v1/settings', {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ photoDirs }),
  //   });

  //   newSettings && setSettings(newSettings.data);
  // };

  const initSetting = async () => {
    await request('/api/v1/settings', {
      method: 'PUT',
      body: JSON.stringify({
        photoDirs: ['/Users/arthur/Pictures/sample-photos/test2'],
      }),
    });
  };

  const handleScan = async () => {
    await request('/api/v1/photos/scan', {
      method: 'POST',
    });
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

        <Button onClick={initSetting}>InitSetting</Button>
        <Button onClick={handleScan}>Scan</Button>
        {/* <ScanDirectories
          photoDirs={settings.photoDirs}
          onChange={(photoDirs) => updateSettings({ photoDirs })}
        /> */}
      </div>
    </div>
  );
}
