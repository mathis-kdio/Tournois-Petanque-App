import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import React, { useEffect } from 'react';
import { Appearance, ColorSchemeName, Platform, View, ViewProps } from 'react-native';
import { config } from './config';

export type ThemeType = 'basic' | 'original';
export type ModeType = 'light' | 'dark' | 'system';

export function GluestackUIProvider({
  theme,
  mode = 'system',
  ...props
}: {
  theme: ThemeType;
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  // Determiner le mode effectif (resout 'system' en light/dark)
  const effectiveMode = mode === 'system'
    ? Appearance.getColorScheme() || 'light'
    : mode;

  useEffect(() => {
    // Pour le web: appliquer une classe CSS a l'element html
    if (Platform.OS === 'web') {
      const html = document.documentElement;

      // Retirer toutes les classes de theme existantes
      Object.keys(config).forEach(themeName => {
        ['light', 'dark'].forEach(modeName => {
          html.classList.remove(`${themeName}-${modeName}`);
        });
      });

      // Ajouter la classe du theme et mode actuel
      html.classList.add(`${theme}-${effectiveMode}`);
    }

    // Appliquer le color scheme pour React Native
    Appearance.setColorScheme(effectiveMode as ColorSchemeName);
  }, [theme, mode, effectiveMode]);

  return (
    <View
      style={[
        { flex: 1, height: '100%', width: '100%' },
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
