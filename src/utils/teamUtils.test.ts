import { getTeamCounts, getMaxPlayersPerTeam } from './teamUtils';
import { TypeEquipes } from '@/types/enums/typeEquipes';
import { JoueurModel } from '@/types/interfaces/joueurModel';

const makeJoueur = (equipe: number | undefined): JoueurModel => ({
  uniqueBDDId: 0,
  joueurTournoiId: 0,
  name: '',
  type: undefined,
  equipe,
  isChecked: true,
});

describe('getTeamCounts', () => {
  it('compte les joueurs par équipe', () => {
    const players = [
      makeJoueur(1),
      makeJoueur(1),
      makeJoueur(2),
      makeJoueur(2),
      makeJoueur(2),
    ];
    expect(getTeamCounts(players)).toEqual({ 1: 2, 2: 3 });
  });

  it('ignore les joueurs sans équipe', () => {
    const players = [makeJoueur(1), makeJoueur(undefined), makeJoueur(1)];
    expect(getTeamCounts(players)).toEqual({ 1: 2 });
  });

  it('retourne un objet vide pour un tableau vide', () => {
    expect(getTeamCounts([])).toEqual({});
  });
});

describe('getMaxPlayersPerTeam', () => {
  it('retourne 1 pour TETEATETE', () => {
    expect(getMaxPlayersPerTeam(TypeEquipes.TETEATETE)).toBe(1);
  });

  it('retourne 2 pour DOUBLETTE', () => {
    expect(getMaxPlayersPerTeam(TypeEquipes.DOUBLETTE)).toBe(2);
  });

  it('retourne 3 pour TRIPLETTE', () => {
    expect(getMaxPlayersPerTeam(TypeEquipes.TRIPLETTE)).toBe(3);
  });
});
