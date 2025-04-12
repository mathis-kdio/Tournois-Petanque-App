import { JoueurType } from '../enums/joueurType';

export interface Joueur {
  id: number;
  name: string;
  type: JoueurType | undefined;
  equipe: number;
  isChecked: boolean;
}
