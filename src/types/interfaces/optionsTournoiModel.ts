import { Complement } from '../enums/complement';
import { ModeTournoi } from '../enums/modeTournoi';
import { TypeEquipes } from '../enums/typeEquipes';
import { TypeTournoi } from '../enums/typeTournoi';
import { JoueurModel } from './joueurModel';

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
  listeJoueurs: JoueurModel[];
  avecTerrains: boolean;
  mode: ModeTournoi;
}
