import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

import { useTheme } from "~/providers/theme";

type ThemeSwitchProps = {
  className?: string;
};

export const ThemeSwitch = ({ className }: ThemeSwitchProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className={className}>
      {theme === "light" ? (
        <MoonIcon className="h-5 w-5 text-white md:h-7 md:w-7" />
      ) : (
        <SunIcon className="h-5 w-5 text-white md:h-7 md:w-7" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
