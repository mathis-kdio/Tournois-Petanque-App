import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import { useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import { config } from './config';

export type ThemeType = 'basic' | 'original';
export type ModeType = 'light' | 'dark' | 'system';

export function GluestackUIProvider({
  theme,
  mode = 'light',
  ...props
}: {
  theme: ThemeType;
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const effectiveColorScheme = mode === 'system' ? colorScheme ?? 'light' : mode;

  useEffect(() => {
    if (mode !== 'system') {
      setColorScheme(mode);
    }
  }, [mode, setColorScheme]);

  return (
    <View
      style={[
        config[theme][effectiveColorScheme],
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
