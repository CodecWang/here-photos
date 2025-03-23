import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { useLanguage } from '~/app/language-provider';

import { useNavMode } from '../../nav-provider';

export default function Apperence() {
  const t = useTranslations();
  const { locale, setLocale } = useLanguage();
  const { navMode, setNavMode } = useNavMode();
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
        <span className="label-text">Nav Mode</span>
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
          onClick={() => setLocale('zh')}
          disabled={locale === 'zh'}
        >
          {t('language.zh')}
        </button>
        <button
          className="btn"
          onClick={() => setLocale('en')}
          disabled={locale === 'en'}
        >
          {t('language.en')}
        </button>
      </div>
    </div>
  );
}
