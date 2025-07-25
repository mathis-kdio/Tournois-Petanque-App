"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SELECTED_THEME_KEY } from "@/utils/async-storage/key";
import { AppTheme } from "@/utils/theme/theme";

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<AppTheme>("default");

  useEffect(() => {
    (async () => {
      const savedTheme = (await AsyncStorage.getItem(SELECTED_THEME_KEY)) as | AppTheme | "light";
      if (savedTheme) {
        setTheme(savedTheme);
        AsyncStorage.setItem(SELECTED_THEME_KEY, savedTheme);
      }
    })();
  }, []);

  const handleSetTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    AsyncStorage.setItem(SELECTED_THEME_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
