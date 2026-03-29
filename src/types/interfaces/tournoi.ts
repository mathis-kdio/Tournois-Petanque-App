import { MatchModel } from './matchModel';
import { OptionsTournoiModel } from './optionsTournoiModel';

export interface TournoiModel {
  tournoiId: number;
  name?: string;
  estTournoiActuel: boolean;
  creationDate: Date;
  updateDate: Date;
  matchs: MatchModel[];
  options: OptionsTournoiModel;
}
