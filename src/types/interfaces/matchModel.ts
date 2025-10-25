import { JoueurModel } from './joueurModel';
import { TerrainModel } from './terrainModel';

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
  terrain: TerrainModel | undefined;
}
