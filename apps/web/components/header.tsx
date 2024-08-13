import { useTheme } from "next-themes";
import Upload from "./upload";
import DarkModeIcon from "@/icons/dark-mode-icon";
import LightModeIcon from "@/icons/light-mode-icon";
import MenuIcon from "@/icons/menu-icon";
import SearchIcon from "@/icons/search-icon";

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-base-200 text-base-content fixed top-0 z-20 flex h-16 w-full justify-center">
      <nav className="navbar w-full">
        <div className="flex-none">
          <label
            htmlFor="side-nav-drawer"
            className="btn btn-square btn-ghost drawer-button lg:hidden"
          >
            <MenuIcon className="size-6" />
          </label>
        </div>
        <div className="w-64 flex-none">
          <a className="text-xl">Here Photos</a>
        </div>

        <div className="flex flex-1">
          <label className="input hidden flex-1 items-center gap-2 rounded-full md:flex md:max-w-[500px]">
            <SearchIcon className="size-5" />
            <input
              type="text"
              className="grow"
              placeholder="Try search with natural language"
              onSelect={() => alert("hha")}
            />
            <span className="opacity-50 rtl:flex-row-reverse">
              <kbd className="kbd kbd-sm">⌘</kbd>
              <kbd className="kbd kbd-sm">K</kbd>
            </span>
          </label>
        </div>

        <div className="flex-none">
          <button className="btn btn-circle btn-ghost md:hidden">
            <SearchIcon className="size-6" />
          </button>
          <Upload />

          <div
            className="tooltip tooltip-bottom"
            data-tip={theme === "dark" ? "Light" : "Dark"}
          >
            <button className="btn btn-circle btn-ghost">
              <label className="swap swap-rotate">
                <input
                  type="checkbox"
                  className="theme-controller"
                  checked={theme !== "dark"}
                  onChange={(e) => {
                    console.log(e.target.checked, theme);

                    setTheme(e.target.checked ? "light" : "dark");
                  }}
                />
                <LightModeIcon className="swap-off size-6" />
                <DarkModeIcon className="swap-on size-6" />
              </label>
            </button>
          </div>

          <button className="btn btn-circle">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
          </button>
        </div>
      </nav>
    </header>
  );
}
