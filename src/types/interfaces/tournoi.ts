import { Match } from "./match";

export interface tournoi {
  tournoiId: number;
  name: string;
  creationDate: Date;
  updateDate: Date;
  tournoi: Match[];
}