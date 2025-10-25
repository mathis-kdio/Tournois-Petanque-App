import { JoueurType } from '../enums/joueurType';

export interface JoueurModel {
  id: number;
  name: string;
  type: JoueurType | undefined;
  equipe: number;
  isChecked: boolean;
}
