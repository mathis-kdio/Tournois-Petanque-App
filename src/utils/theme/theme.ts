export type AppTheme = 'light' | 'dark' | 'default';

export type AppGlobalTheme = 'basic' | 'original';

export type AppStyle = 'light' | 'dark';

export const getTheme = (theme: AppTheme) => {
  let globalTheme: AppGlobalTheme;
  let style: AppStyle;
  if (theme === 'default') {
    globalTheme = 'original';
    style = 'light';
  } else {
    globalTheme = 'basic';
    style = theme;
  }
  return { globalTheme, style };
};

export const getThemeColor = (theme: AppTheme) => {
  const themeColor: { [key in AppTheme]: string } = {
    light: '#ffffff',
    dark: '#121212',
    default: '#0594AE',
  };
  return themeColor[theme];
};
