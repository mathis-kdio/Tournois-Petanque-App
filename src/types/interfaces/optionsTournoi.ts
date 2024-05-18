import { Complement } from "../enums/complement";
import { TypeEquipes } from "../enums/typeEquipes";
import { TypeTournoi } from "../enums/typeTournoi";
import { Joueur } from "./joueur";

export interface OptionsTournoi {
  tournoiID: number;
  listeJoueurs: Joueur[];
  typeEquipes: TypeEquipes;
  typeTournoi: TypeTournoi;
  nbTours: number;
  nbMatchs: number;
  nbPtVictoire: number;
  complement: Complement;
  avecTerrains: boolean;
  memesEquipes: boolean;
  memesAdversaires: number;
  speciauxIncompatibles: boolean;
}