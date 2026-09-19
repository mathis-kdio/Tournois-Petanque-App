import { AppTheme, getTheme, getThemeColor } from './theme';

describe('getTheme', () => {
  it('retourne le thème original et le style light pour "default"', () => {
    expect(getTheme('default')).toEqual({
      globalTheme: 'original',
      style: 'light',
    });
  });

  it('retourne le thème basic et le style light pour "light"', () => {
    expect(getTheme('light')).toEqual({ globalTheme: 'basic', style: 'light' });
  });

  it('retourne le thème basic et le style dark pour "dark"', () => {
    expect(getTheme('dark')).toEqual({ globalTheme: 'basic', style: 'dark' });
  });

  it('couvre tous les cas possibles de AppTheme', () => {
    const themes: AppTheme[] = ['light', 'dark', 'default'];
    themes.forEach((theme) => {
      const result = getTheme(theme);
      expect(result).toHaveProperty('globalTheme');
      expect(result).toHaveProperty('style');
    });
  });
});

describe('getThemeColor', () => {
  it('retourne #ffffff pour le thème light', () => {
    expect(getThemeColor('light')).toBe('#ffffff');
  });

  it('retourne #121212 pour le thème dark', () => {
    expect(getThemeColor('dark')).toBe('#121212');
  });

  it('retourne #0594AE pour le thème default', () => {
    expect(getThemeColor('default')).toBe('#0594AE');
  });
});
