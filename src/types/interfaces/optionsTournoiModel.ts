import { Complement } from '../enums/complement';
import { ModeTournoi } from '../enums/modeTournoi';
import { TypeEquipes } from '../enums/typeEquipes';
import { TypeTournoi } from '../enums/typeTournoi';
import { MemesAdversairesType } from './preparationTournoiModel';

export interface OptionsTournoiModel {
  tournoiID: number;
  nbTours: number;
  nbMatchs: number;
  nbPtVictoire: number;
  speciauxIncompatibles: boolean;
  memesEquipes: boolean;
  memesAdversaires: MemesAdversairesType;
  typeEquipes: TypeEquipes;
  complement?: Complement;
  typeTournoi: TypeTournoi;
  avecTerrains: boolean;
  mode: ModeTournoi;
}
