import { EquipesType } from './equipeType';
import { TerrainModel } from './terrainModel';

export interface MatchModel {
  matchId: number;
  score1: number | undefined;
  score2: number | undefined;
  manche: number;
  mancheName: string | undefined;
  equipe: EquipesType;
  terrain: TerrainModel | undefined;
}
