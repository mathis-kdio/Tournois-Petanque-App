import { Terrain } from '@/db/schema';
import { TerrainModel } from '@/types/interfaces/terrainModel';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { TerrainsRepository } from '../terrains/terrainsRepository';
import { TerrainsPreparationTournoisRepository } from './terrainsPreparationTournoiRepository';

function toTerrainModel(terrain: Terrain): TerrainModel {
  return {
    id: terrain.id,
    name: terrain.name,
  };
}

export function useTerrainsPreparationTournois() {
  const { data: tousLesTerrains = [] } = useLiveQuery(
    TerrainsRepository.getAll(),
  );

  const { data: liaisons = [] } = useLiveQuery(
    TerrainsPreparationTournoisRepository.getIdsInPreparation(0),
  );

  const terrainsVM = () => {
    if (!tousLesTerrains.length || !liaisons.length) {
      return [];
    }
    const idsEnPreparation = new Set(liaisons.map((l) => l.terrainId));
    return tousLesTerrains.reduce((acc, t) => {
      if (idsEnPreparation.has(t.id)) {
        acc.push(toTerrainModel(t));
      }
      return acc;
    }, [] as TerrainModel[]);
  };

  return {
    terrains: terrainsVM(),
  };
}
