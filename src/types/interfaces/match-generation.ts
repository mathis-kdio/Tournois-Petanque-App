import { TerrainModel } from './terrainModel';

export type EquipesGenerationType = [
  EquipeGenerationType,
  EquipeGenerationType,
];

export type EquipeGenerationType = [
  number | undefined | -1,
  number | undefined | -1,
  number | undefined | -1,
  number | undefined | -1,
];

export interface MatchGeneration {
  id: number;
  score1: number | undefined;
  score2: number | undefined;
  manche: number;
  mancheName: string | undefined;
  equipe: EquipesGenerationType;
  terrain: TerrainModel | undefined;
}
