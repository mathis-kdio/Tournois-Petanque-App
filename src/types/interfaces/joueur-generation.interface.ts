import { JoueurType } from '../enums/joueurType';

export interface JoueurGeneration {
  id: number;
  name: string;
  type: JoueurType | undefined;
  isChecked: boolean;
  allCoequipiers: number[];
  allAdversaires: number[];
}

export interface JoueurGenerationTeteATete {
  uniqueBDDId: number;
  joueurTournoiId: number;
  name: string;
  type: JoueurType | undefined;
  equipe: number[];
  isChecked: boolean;
}
