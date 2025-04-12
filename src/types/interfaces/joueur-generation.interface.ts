import { JoueurType } from '../enums/joueurType';

export interface JoueurGeneration {
  id: number;
  name: string;
  type: JoueurType;
  isChecked: boolean;
  coequipier: number[];
}
