import { NewTerrain, Terrain } from '@/db/schema';
import { NewTerrainsPreparationTournois } from '@/db/schema/terrainsPreparationTournoi';
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

function toNewTerrain(terrainName: string): NewTerrain {
  return {
    name: terrainName,
    updatedAt: null,
    synced: null,
  };
}

function toNewTerrainsPreparationTournois(
  terrain: TerrainModel,
  preparationTournoiId: number,
): NewTerrainsPreparationTournois {
  return {
    terrainId: terrain.id,
    preparationTournoiId,
  };
}

const insertTerrain = async (terrainName: string) => {
  const terrain = await TerrainsRepository.insert(toNewTerrain(terrainName));
  await TerrainsPreparationTournoisRepository.insert(
    toNewTerrainsPreparationTournois(terrain, 0),
  );
};

const deleteTerrain = async (terrainId: number) => {
  await TerrainsPreparationTournoisRepository.delete(terrainId);
  await TerrainsRepository.delete([terrainId]);
};

const renameTerrain = async (terrainId: number, name: string) => {
  await TerrainsRepository.rename(terrainId, name);
};

export function useTerrainsPreparationTournois() {
  const { data: tousLesTerrains = [] } = useLiveQuery(
    TerrainsRepository.getAll(),
  );

  const { data: liaisons = [] } = useLiveQuery(
    TerrainsPreparationTournoisRepository.getIdsInPreparation(0),
  );

  const terrainsVm = () => {
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
    terrains: terrainsVm(),
    insertTerrain,
    deleteTerrain,
    renameTerrain,
  };
}
