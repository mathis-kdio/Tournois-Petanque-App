import { Joueur } from './joueur';
import { Terrain } from './terrain';

export interface MatchModel {
  id: number;
  score1: number | undefined;
  score2: number | undefined;
  manche: number;
  mancheName: string | undefined;
  equipe: [
    [
      Joueur | undefined,
      Joueur | undefined,
      Joueur | undefined,
      Joueur | undefined,
    ],
    [
      Joueur | undefined,
      Joueur | undefined,
      Joueur | undefined,
      Joueur | undefined,
    ],
  ];
  terrain: Terrain | undefined;
}
