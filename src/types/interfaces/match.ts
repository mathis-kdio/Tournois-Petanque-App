import { JoueurModel } from './joueurModel';
import { Terrain } from './terrain';

export interface MatchModel {
  id: number;
  score1: number | undefined;
  score2: number | undefined;
  manche: number;
  mancheName: string | undefined;
  equipe: [
    [
      JoueurModel | undefined,
      JoueurModel | undefined,
      JoueurModel | undefined,
      JoueurModel | undefined,
    ],
    [
      JoueurModel | undefined,
      JoueurModel | undefined,
      JoueurModel | undefined,
      JoueurModel | undefined,
    ],
  ];
  terrain: Terrain | undefined;
}
