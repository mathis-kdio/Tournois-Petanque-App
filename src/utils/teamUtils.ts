import { TypeEquipes } from '@/types/enums/typeEquipes';
import { JoueurModel } from '@/types/interfaces/joueurModel';

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
