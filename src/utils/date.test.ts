import {
  dateFormatDateCompact,
  dateFormatDateFileName,
  dateFormatDateHeure,
} from './date';

describe('dateFormatDateHeure', () => {
  it("formate une date avec le jour et l'heure en français", () => {
    const date = new Date('2024-12-25T14:30:00');
    const result = dateFormatDateHeure(date);
    // Le format exact dépend du timezone, on vérifie juste la structure
    expect(result).toMatch(/25 décembre 2024/);
    expect(result).toMatch(/14:30/);
  });

  it("gère une date en début d'année", () => {
    const date = new Date('2024-01-01T00:00:00');
    const result = dateFormatDateHeure(date);
    expect(result).toMatch(/1 janvier 2024/);
  });
});

describe('dateFormatDateCompact', () => {
  it('formate une date au format compact JJ/MM/AAAA', () => {
    const date = new Date('2024-12-25');
    expect(dateFormatDateCompact(date)).toBe('25/12/2024');
  });

  it('retourne undefined pour une date nulle', () => {
    expect(dateFormatDateCompact(null as unknown as Date)).toBeUndefined();
  });
});

describe('dateFormatDateFileName', () => {
  it('formate une date avec des tirets pour un nom de fichier', () => {
    const date = new Date('2024-12-25');
    expect(dateFormatDateFileName(date)).toBe('25-12-2024');
  });

  it('retourne undefined pour une date nulle', () => {
    expect(dateFormatDateFileName(null as unknown as Date)).toBeUndefined();
  });
});
