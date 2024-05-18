import { Complement } from "../enums/complement";
import { TypeEquipes } from "../enums/typeEquipes";
import { Joueur } from "./joueur";

export interface Tournoi {
  tournoiId: number;
  name: string;
  creationDate: Date;
  updateDate: Date;
  listeJoueurs: Joueur[];
  typeEquipes: TypeEquipes;
  nbTours: number;
  nbMatchs: number;
  nbPtVictoire: number;
  complement: Complement;
  memesEquipes: boolean;
  memesAdversaires: number;
  speciauxIncompatibles: boolean;
}