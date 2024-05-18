import { Complement } from "../enums/complement";
import { TypeEquipes } from "../enums/typeEquipes";

export interface Tournoi {
  tournoiId: number;
  name: string;
  creationDate: Date;
  updateDate: Date;
  listeJoueurs: ;
  typeEquipes: TypeEquipes;
  nbTours: number;
  nbMatchs: number;
  nbPtVictoire: number;
  complement: Complement;
  memesEquipes: boolean;
  memesAdversaires: number;
  speciauxIncompatibles: boolean;
}