import { Complement } from '../enums/complement';
import { ModeCreationEquipes } from '../enums/modeCreationEquipes';
import { ModeTournoi } from '../enums/modeTournoi';
import { TypeEquipes } from '../enums/typeEquipes';
import { TypeTournoi } from '../enums/typeTournoi';

export type MemesAdversairesType = 0 | 50 | 100;

export interface PreparationTournoiModel {
  id: number;
  nbTours?: number;
  nbMatchs?: number;
  nbPtVictoire?: number;
  speciauxIncompatibles?: boolean;
  memesEquipes?: boolean;
  memesAdversaires?: MemesAdversairesType;
  typeEquipes?: TypeEquipes;
  complement?: Complement;
  typeTournoi?: TypeTournoi;
  avecTerrains?: boolean;
  mode?: ModeTournoi;
  modeCreationEquipes?: ModeCreationEquipes;
}
