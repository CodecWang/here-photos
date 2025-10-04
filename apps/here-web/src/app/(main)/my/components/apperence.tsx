import { useAtom, useSetAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { navModeAtom } from '~/atoms';
import { localeAtom } from '~/atoms/i18n';

export default function Apperence() {
  const t = useTranslations();
  const setLocale = useSetAtom(localeAtom);

  const [navMode, setNavMode] = useAtom(navModeAtom);
  const { setTheme } = useTheme();

  const toggleNavMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNavMode(e.target.checked ? 1 : 0);
  };

  return (
    <div className="bg-base-200 rounded-box flex-1 p-4 hover:shadow-2xl">
      <div>
        <span className="text-xl">{t('apperence.title')}</span>
      </div>
      <label className="label cursor-pointer">
        <span className="label-text">{t('nav.title')}</span>
        <input
          type="checkbox"
          className="toggle"
          checked={Boolean(navMode)}
          onChange={toggleNavMode}
        />
      </label>

      <div>
        <button className="btn" onClick={() => setTheme('light')}>
          {t('apperence.light')}
        </button>
        <button className="btn" onClick={() => setTheme('system')}>
          {t('apperence.system')}
        </button>
        <button className="btn" onClick={() => setTheme('dark')}>
          {t('apperence.dark')}
        </button>
      </div>
      <div>
        <button
          className="btn"
          // onClick={() => setLocale('zh')}
          onClick={() => setLocale('zh')}
          // disabled={locale === 'zh'}
        >
          简体中文
        </button>
        <button
          className="btn"
          // onClick={() => setLocale('en')}
          onClick={() => setLocale('en')}
          // disabled={locale === 'en'}
        >
          {t('language.en')}
        </button>
      </div>
    </div>
  );
}
