import { MatchModel } from './match';
import { OptionsTournoiModel } from './optionsTournoi';

export interface TournoiModel {
  tournoiId: number;
  name?: string;
  creationDate: Date;
  updateDate: Date;
  matchs: MatchModel[];
  options: OptionsTournoiModel;
}
