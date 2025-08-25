import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';

type ThemeContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggleTheme: () => {},
});

const THEME_STORAGE_KEY = 'uiTheme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Render light on server and initial client render to avoid hydration mismatch
  const [isDark, setIsDark] = useState<boolean>(false);

  // After mount, resolve actual preference and update
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      const preferred = saved
        ? saved === 'dark'
        : !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDark(preferred);
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } catch {}
  }, [isDark]);

  const value = useMemo<ThemeContextValue>(() => ({
    isDark,
    toggleTheme: () => setIsDark((prev) => !prev),
  }), [isDark]);

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: isDark
            ? {
                borderRadius: 12,
              }
            : {
                // Light theme tokens
                colorBgLayout: '#f5f6f8',
                colorBgContainer: '#ffffff',
                colorBorder: '#e6e8eb',
                colorBorderSecondary: '#eef0f2',
                borderRadius: 12,
                borderRadiusLG: 16,
                borderRadiusSM: 10,
              },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}


