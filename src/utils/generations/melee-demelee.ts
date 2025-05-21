import { JoueurGeneration } from '@/types/interfaces/joueur-generation.interface';

export function testAffectationPossible(
  tour: number,
  joueur: JoueurGeneration,
  jamaisMemeCoequipier: boolean,
  speciauxIncompatibles: boolean,
  eviterMemeAdversaire: number,
  nbTours: number,
  currentEquipe: [number, number, number, number],
  currentAdversaire: [number, number, number, number],
  listeJoueurs: JoueurGeneration[],
): boolean {
  const coequipiersActuels = currentEquipe.filter((id) => id !== -1);

  //Test speciauxIncompatibles
  if (
    speciauxIncompatibles &&
    joueur.type &&
    coequipiersActuels.some(
      (id) => listeJoueurs[id]?.type && listeJoueurs[id]?.type === joueur.type,
    )
  ) {
    return false;
  }

  //Test eviterMemeAdversaire
  if (eviterMemeAdversaire !== 100 && tour !== 0) {
    const adversairesActuels = currentAdversaire.filter((id) => id !== -1);
    const maxRencontres =
      eviterMemeAdversaire === 50 ? Math.floor(nbTours / 2) : 1;
    for (const adversaire of adversairesActuels) {
      const nbRencontres = occuAdversaire(joueur.allAdversaires, adversaire);
      if (nbRencontres >= maxRencontres) {
        return false;
      }
    }
  }

  //Test jamaisMemeCoequipier
  if (!jamaisMemeCoequipier || tour === 0) {
    return true;
  }

  if (
    coequipiersActuels.some((coequipierActuel) =>
      joueur.allCoequipiers.includes(coequipierActuel),
    )
  ) {
    return false;
  }

  return true;
}

function occuAdversaire(arr: number[], val: number) {
  return arr.filter((x) => x === val).length;
}

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
