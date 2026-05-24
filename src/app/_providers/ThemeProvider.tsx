"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { ColorThemeType } from "@prisma/client";
import { colorThemeVariables } from "@/constants/colorThemes";

import { Profile } from "@/schemas/me";
import useFetch from "../admin/_hooks/useFetch";

type CSSVariables = CSSProperties & {
  [key: `--${string}`]: string;
};

type ThemeContextType = {
  colorTheme: ColorThemeType;
  setColorTheme: (theme: ColorThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

type ThemeProviderProps = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { data } = useFetch<{ profile: Profile }>("/api/me");

  const [colorTheme, setColorTheme] = useState<ColorThemeType>(
    ColorThemeType.ORIGINAL,
  );

  useEffect(() => {
    if (data?.profile.colorTheme) {
      setColorTheme(data.profile.colorTheme);
    }
  }, [data?.profile.colorTheme]);

  const themeVariables: CSSVariables =
    colorThemeVariables[colorTheme] ??
    colorThemeVariables[ColorThemeType.ORIGINAL];

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      <div style={themeVariables}>{children}</div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};
