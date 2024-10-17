import { Match } from './match';
import { OptionsTournoi } from './optionsTournoi';

export interface Tournoi {
  tournoiId: number;
  name: string;
  creationDate: Date;
  updateDate: Date;
  tournoi: [...Match[], OptionsTournoi];
}
