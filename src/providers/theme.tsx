import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";

interface IState {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<IState | undefined>(undefined);

const LOCAL_STORAGE_THEME_KEY = "theme";
const DARK_MODE_CLASS_NAME = "dark";

function addDarkModeClassName() {
  document.documentElement.classList.add(DARK_MODE_CLASS_NAME);
}

function removeDarkModeClassName() {
  document.documentElement.classList.remove(DARK_MODE_CLASS_NAME);
}

interface IThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: IThemeProviderProps) => {
  const isBrowser = typeof window !== "undefined";

  const localStorageTheme = (
    isBrowser ? window.localStorage?.getItem(LOCAL_STORAGE_THEME_KEY) : null
  ) as Theme | null;

  const [theme, setTheme] = useState<Theme>(localStorageTheme || "light");

  useEffect(() => {
    const prefersDarkTheme =
      localStorageTheme === "dark" ||
      (!localStorageTheme &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches);

    if (prefersDarkTheme) {
      setTheme("dark");
      addDarkModeClassName();
    } else {
      setTheme("light");
      removeDarkModeClassName();
    }
  }, [localStorageTheme]);

  function toggleTheme() {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === "light" ? "dark" : "light";

      if (nextTheme === "dark") {
        addDarkModeClassName();
      } else {
        removeDarkModeClassName();
      }

      if (isBrowser) {
        window.localStorage?.setItem("theme", nextTheme);
      }

      return nextTheme;
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeContext provider");
  }
  return context;
}
