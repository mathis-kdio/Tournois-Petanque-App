import { useCallback } from 'react';
import { TerrainsRepository } from './terrainsRepository';
import { Terrain } from '@/db/schema';
import { TerrainModel } from '@/types/interfaces/terrainModel';

function toTerrainModel(terrain: Terrain): TerrainModel {
  return {
    id: terrain.id,
    name: terrain.name,
  };
}

function toTerrain(terrain: TerrainModel): Terrain {
  return {
    id: terrain.id,
    name: terrain.name,
    updatedAt: null,
    synced: null,
  };
}

export function useTerrains() {
  const getActualTerrains = useCallback(async () => {
    const terrains = await TerrainsRepository.getTerrains();
    console.log(terrains);
    return terrains.map(toTerrainModel);
  }, []);

  const insertTerrain = useCallback((terrainModel: TerrainModel) => {
    const terrain = toTerrain(terrainModel);
    TerrainsRepository.insertTerrains(terrain);
  }, []);

  const updateTerrain = useCallback((terrainModel: TerrainModel) => {
    const terrain = toTerrain(terrainModel);
    TerrainsRepository.updateTerrain(terrain);
  }, []);

  return {
    getActualTerrains,
    insertTerrain,
    updateTerrain,
  };
}
