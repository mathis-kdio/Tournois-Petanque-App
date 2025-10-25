import { MatchModel } from './matchModel';
import { OptionsTournoiModel } from './optionsTournoiModel';

export interface TournoiModel {
  tournoiId: number;
  name?: string;
  creationDate: Date;
  updateDate: Date;
  matchs: MatchModel[];
  options: OptionsTournoiModel;
}
