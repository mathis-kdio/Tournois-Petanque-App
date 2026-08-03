'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import { script } from './script';
import { config } from './config';

export type ThemeType = 'basic' | 'original';
export type ModeType = 'light' | 'dark' | 'system';

export const useSafeLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function GluestackUIProvider({
  theme = 'basic',
  mode = 'light',
  ...props
}: {
  theme?: ThemeType;
  mode?: ModeType;
  children?: React.ReactNode;
}) {
  // Determiner le mode effectif
  const effectiveMode = mode === 'system' 
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : mode;

  const handleMediaQuery = React.useCallback((e: MediaQueryListEvent) => {
    const newMode = e.matches ? 'dark' : 'light';
    script(newMode);
    applyThemeClasses(theme, newMode);
  }, [theme]);

  // Appliquer les classes de theme
  const applyThemeClasses = React.useCallback((theme: ThemeType, mode: ModeType) => {
    const documentElement = document.documentElement;
    if (!documentElement) return;
    
    // Retirer toutes les classes de theme existantes
    Object.keys(config).forEach(themeName => {
      ['light', 'dark'].forEach(modeName => {
        documentElement.classList.remove(`${themeName}-${modeName}`);
      });
    });
    
    // Ajouter la classe du theme et mode actuel
    documentElement.classList.add(`${theme}-${mode}`);
    
    // Appliquer le color scheme
    documentElement.style.colorScheme = mode;
  }, [theme]);

  useSafeLayoutEffect(() => {
    applyThemeClasses(theme, effectiveMode);
  }, [theme, effectiveMode, applyThemeClasses]);

  useSafeLayoutEffect(() => {
    if (mode !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    media.addListener(handleMediaQuery);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  return (
    <>
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `(${script.toString()})('${effectiveMode}')`,
        }}
      />
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </>
  );
}