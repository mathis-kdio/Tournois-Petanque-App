'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { config } from './config';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { ToastProvider } from '@gluestack-ui/toast';
import { setFlushStyles } from '@gluestack-ui/nativewind-utils/flush';
import { script } from './script';

export type ThemeType = 'basic' | 'original';
export type ModeType = 'light' | 'dark' | 'system';

const variableStyleTagId = 'nativewind-style';
const createStyle = (styleTagId: string) => {
  const style = document.createElement('style');
  style.id = styleTagId;
  style.appendChild(document.createTextNode(''));
  return style;
};

export const useSafeLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function GluestackUIProvider({
  theme,
  mode = 'light',
  ...props
}: {
  theme: ThemeType; 
  mode?: ModeType;
  children?: React.ReactNode;
}) {
  let cssVariablesWithMode = ``;
  let themeConfig = config[theme]
  Object.keys(themeConfig).forEach((configKey) => {
    cssVariablesWithMode += configKey === 'dark' ? `\n .dark {\n ` : `\n:root {\n`;
    const cssVariables = Object.keys(
      themeConfig[configKey as keyof typeof themeConfig]
    ).reduce((acc: string, curr: string) => {
      acc += `${curr}:${themeConfig[configKey as keyof typeof themeConfig][curr]}; `;
      return acc;
    }, '');
    cssVariablesWithMode += `${cssVariables} \n}`;
  });

  setFlushStyles(cssVariablesWithMode);

  const handleMediaQuery = React.useCallback((e: MediaQueryListEvent) => {
    script(e.matches ? 'dark' : 'light');
  }, []);

  useSafeLayoutEffect(() => {
    if (mode !== 'system') {
      const documentElement = document.documentElement;
      if (documentElement) {
        documentElement.classList.add(mode);
        documentElement.classList.remove(mode === 'light' ? 'dark' : 'light');
        documentElement.style.colorScheme = mode;
      }
    }
  }, [mode, theme]);

  useSafeLayoutEffect(() => {
    if (mode !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    media.addListener(handleMediaQuery);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  useSafeLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const documentElement = document.documentElement;
    if (!documentElement) return
    const head = documentElement.querySelector('head');
    if (!head) return;

    const nodeToRemove = document.querySelector(`[id='${variableStyleTagId}']`);
    if (nodeToRemove) {
      head.removeChild(nodeToRemove)
    }
    let style = createStyle(variableStyleTagId);
    style.innerHTML = cssVariablesWithMode;
    head.appendChild(style);
  }, [mode, theme]);

  return (
    <>
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `(${script.toString()})('${mode}')`,
        }}
      />
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </>
  );
}
