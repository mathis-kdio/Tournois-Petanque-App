import { Terrain } from "./terrain";

export interface Match {
  id: number;
  score1: string;
  score2: string;
  manche: number;
  mancheName: string;
  equipe: [[number, number, number], [number, number, number]];
  terrain: Terrain;
}