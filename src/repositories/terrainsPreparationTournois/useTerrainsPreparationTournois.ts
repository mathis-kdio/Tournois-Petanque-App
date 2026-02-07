import { useMemo } from 'react';
import { NewTerrain, Terrain } from '@/db/schema';
import { TerrainModel } from '@/types/interfaces/terrainModel';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { TerrainsPreparationTournoisRepository } from './terrainsPreparationTournoiRepository';
import { TerrainsRepository } from '../terrains/terrainsRepository';
import { NewTerrainsPreparationTournois } from '@/db/schema/terrainsPreparationTournoi';

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

export function useTerrainsPreparationTournois() {
  const { data: tousLesTerrains = [] } = useLiveQuery(
    TerrainsRepository.getAll(),
  );

  const { data: liaisons = [] } = useLiveQuery(
    TerrainsPreparationTournoisRepository.getIdsInPreparation(0),
  );

  const terrainsVm = useMemo(() => {
    if (!tousLesTerrains.length || !liaisons.length) {
      return [];
    }
    const idsEnPreparation = new Set(liaisons.map((l) => l.terrainId));
    return tousLesTerrains
      .filter((t) => idsEnPreparation.has(t.id))
      .map((t) => toTerrainModel(t));
  }, [tousLesTerrains, liaisons]);

  const insertTerrain = async (terrainName: string) => {
    const terrain = await TerrainsRepository.insert(toNewTerrain(terrainName));
    await TerrainsPreparationTournoisRepository.insert(
      toNewTerrainsPreparationTournois(terrain, 0),
    );
  };

  const deleteTerrain = async (terrainId: number) => {
    await TerrainsPreparationTournoisRepository.delete(terrainId);
    await TerrainsRepository.delete(terrainId);
  };

  const renameTerrain = async (terrainId: number, name: string) => {
    await TerrainsRepository.rename(terrainId, name);
  };

  return {
    terrains: terrainsVm,
    insertTerrain,
    deleteTerrain,
    renameTerrain,
  };
}
