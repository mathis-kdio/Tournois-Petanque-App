import { NewTerrain } from '@/db/schema';
import { NewTerrainsPreparationTournois } from '@/db/schema/terrainsPreparationTournoi';
import { TerrainModel } from '@/types/interfaces/terrainModel';
import { TerrainsRepository } from '../terrains/terrainsRepository';
import { TerrainsPreparationTournoisRepository } from './terrainsPreparationTournoiRepository';

function toNewTerrain(terrainName: string): NewTerrain {
  return {
    name: terrainName,
  };
}

function toNewTerrainsPreparationTournois(
  terrain: TerrainModel,
  preparationTournoiId: string,
): NewTerrainsPreparationTournois {
  return {
    terrainId: terrain.id,
    preparationTournoiId,
  };
}

export const insertTerrain = async (terrainName: string) => {
  const terrain = await TerrainsRepository.insert(toNewTerrain(terrainName));
  await TerrainsPreparationTournoisRepository.insert(
    toNewTerrainsPreparationTournois(terrain, '0'),
  );
};

export const deleteTerrain = async (terrainId: string) => {
  await TerrainsPreparationTournoisRepository.delete(terrainId);
  await TerrainsRepository.delete([terrainId]);
};

export const renameTerrain = async (terrainId: string, name: string) => {
  await TerrainsRepository.rename(terrainId, name);
};
