import { useTheme } from 'next-themes';

import { useNavMode } from '../../nav-provider';

export default function Apperence() {
  const { navMode, setNavMode } = useNavMode();
  const { setTheme } = useTheme();

  const toggleNavMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNavMode(e.target.checked ? 1 : 0);
  };

  return (
    <div className="bg-base-200 rounded-box flex-1 p-4 hover:shadow-2xl">
      <div>
        <span className="text-xl">Apperence</span>
      </div>
      <label className="label cursor-pointer">
        <span className="label-text">Modern Navigation</span>
        <input
          type="checkbox"
          className="toggle"
          checked={Boolean(navMode)}
          onChange={toggleNavMode}
        />
      </label>

      <div>
        <button className="btn" onClick={() => setTheme('light')}>
          light
        </button>
        <button className="btn" onClick={() => setTheme('system')}>
          system
        </button>
        <button className="btn" onClick={() => setTheme('dark')}>
          dark
        </button>
      </div>
    </div>
  );
}
