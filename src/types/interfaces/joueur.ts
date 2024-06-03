import { JoueurType } from "../enums/joueurType";

export interface Joueur {
  id: number;
  name: string;
  type: JoueurType;
  equipe: number;
  isChecked: boolean;
}