'use client';

import { useTheme } from 'next-themes';
import { useContext, useEffect, useState } from 'react';

import { NavContext } from '../nav-provider';
import { request } from '@/utils/request';

interface Settings {
  photoDirs: string[];
}

export default function Page() {
  const [settings, setSettings] = useState<Settings>({ photoDirs: [] });
  const { navMode, setNavMode } = useContext(NavContext);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    (async () => {
      const data = await request('/api/v1/settings');
      data && setSettings(data);
    })();
  }, []);

  const handleChange = (e) => {
    setNavMode(e.target.checked ? 1 : 0);
  };

  return (
    <div>
      <h1>My Page</h1>

      <div className="form-control w-56">
        <label className="label cursor-pointer">
          <span className="label-text">Modern Navigation</span>
          <input
            type="checkbox"
            className="toggle"
            checked={Boolean(navMode)}
            onChange={handleChange}
          />
        </label>

        <button className="btn" onClick={() => setTheme('light')}>
          light
        </button>
        <button className="btn" onClick={() => setTheme('system')}>
          system
        </button>
        <button className="btn" onClick={() => setTheme('dark')}>
          dark
        </button>

        {settings.photoDirs?.map((dir) => <div key={dir}>{dir}</div>)}
      </div>
    </div>
  );
}
