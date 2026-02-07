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
  const { data: terrainsPreparationTournois } = useLiveQuery(
    TerrainsPreparationTournoisRepository.getMany(),
  );

  const terrainsVm = useMemo(() => {
    return terrainsPreparationTournois.length
      ? terrainsPreparationTournois.map(({ terrains }) =>
        toTerrainModel(terrains),
      )
      : [];
  }, [terrainsPreparationTournois]);

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
    // Problème de refresh de terrainsPreparationTournois
    // => Solution : ne pas faire de jointure mais une autre useLiveQuery
    //   => ou ne pas avoir terrainsPreparationTournois dans ce use mais en entrée et avoir uniquement useLiveQuery pour TerrainsRepository
  };

  return {
    terrains: terrainsVm,
    insertTerrain,
    deleteTerrain,
    renameTerrain,
  };
}
