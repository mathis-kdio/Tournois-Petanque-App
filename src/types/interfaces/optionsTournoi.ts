import { Complement } from '../enums/complement';
import { ModeTournoi } from '../enums/modeTournoi';
import { TypeEquipes } from '../enums/typeEquipes';
import { TypeTournoi } from '../enums/typeTournoi';
import { Joueur } from './joueur';

export interface OptionsTournoiModel {
  tournoiID: number;
  nbTours: number;
  nbMatchs: number;
  nbPtVictoire: number;
  speciauxIncompatibles: boolean;
  memesEquipes: boolean;
  memesAdversaires: number;
  typeEquipes: TypeEquipes;
  complement?: Complement;
  typeTournoi: TypeTournoi;
  listeJoueurs: Joueur[];
  avecTerrains: boolean;
  mode: ModeTournoi;
}
