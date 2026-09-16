import { TypeEquipes } from '@/types/enums/typeEquipes';
import { JoueurModel } from '@/types/interfaces/joueurModel';

/**
 * Count players per team efficiently.
 * O(N) complexity where N = number of players.
 */
export const getTeamCounts = (
  players: JoueurModel[],
): Record<number, number> => {
  const counts: Record<number, number> = {};
  players.forEach((player) => {
    if (player.equipe !== undefined) {
      counts[player.equipe] = (counts[player.equipe] || 0) + 1;
    }
  });
  return counts;
};

/**
 * Get the maximum number of players allowed per team based on team type.
 */
export const getMaxPlayersPerTeam = (typeEquipes: TypeEquipes): number => {
  switch (typeEquipes) {
    case TypeEquipes.TETEATETE:
      return 1;
    case TypeEquipes.DOUBLETTE:
      return 2;
    case TypeEquipes.TRIPLETTE:
      return 3;
    default:
      return 1;
  }
};

/**
 * Calculate the total number of teams needed based on players count and team type.
 */
export const getNumberOfTeams = (
  nbPlayers: number,
  typeEquipes: TypeEquipes,
): number => {
  switch (typeEquipes) {
    case TypeEquipes.TETEATETE:
      return nbPlayers;
    case TypeEquipes.DOUBLETTE:
      return Math.ceil(nbPlayers / 2);
    case TypeEquipes.TRIPLETTE:
      return Math.ceil(nbPlayers / 3);
    default:
      return nbPlayers;
  }
};
