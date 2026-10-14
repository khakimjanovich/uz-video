import React, { createContext, useContext } from "react";
import { ThemeTokens, ThemeName, getThemeTokens, DARK_THEME } from "../themes";

export interface ThemeContextValue {
  theme: ThemeName;
  tokens: ThemeTokens;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  tokens: DARK_THEME,
});

export interface ThemeProviderProps {
  theme?: ThemeName;
  tokens?: ThemeTokens;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme = "dark",
  tokens,
  children,
}) => {
  const resolvedTokens = tokens || getThemeTokens(theme);
  return (
    <ThemeContext.Provider value={{ theme, tokens: resolvedTokens }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export const useThemeTokens = () => useContext(ThemeContext).tokens;
