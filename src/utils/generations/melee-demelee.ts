import { JoueurGeneration } from '@/types/interfaces/joueur-generation.interface';

export function updatePlayerRelationships(
  joueurs: JoueurGeneration[],
  equipe: [number, number, number, number],
  equipeAdverse: [number, number, number, number],
) {
  equipe.forEach((joueurId) => {
    if (joueurId !== -1) {
      const coequipiers = equipe.filter((id) => id !== -1 && id !== joueurId);
      const adversaires = equipeAdverse.filter((id) => id !== -1);

      const joueur = joueurs[joueurId];
      joueur.allCoequipiers.push(...coequipiers);
      joueur.allAdversaires.push(...adversaires);
    }
  });
}
