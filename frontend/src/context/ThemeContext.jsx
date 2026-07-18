import {
  useEffect,
  useMemo,
  useState,
} from "react";
import ThemeContext from "./themeContextStore";

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const value = useMemo(
    () => ({ darkMode, setDarkMode }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
