import { MatchModel } from './match';
import { OptionsTournoi } from './optionsTournoi';

export interface TournoiModel {
  tournoiId: number;
  name?: string;
  creationDate: Date;
  updateDate: Date;
  matchs: MatchModel[];
  options: OptionsTournoi;
}
