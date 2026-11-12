import { JoueurType } from '../enums/joueurType';

export interface JoueurModel {
  uniqueBDDId: string;
  joueurTournoiId: number;
  name: string;
  type: JoueurType | undefined;
  equipe: number | undefined;
  isChecked: boolean;
}
