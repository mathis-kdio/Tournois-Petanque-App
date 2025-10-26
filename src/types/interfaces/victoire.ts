import { JoueurModel } from './joueurModel';

export interface Victoire {
  joueur: JoueurModel;
  victoires: number;
  points: number;
  nbMatchs: number;
  position: number;
}
