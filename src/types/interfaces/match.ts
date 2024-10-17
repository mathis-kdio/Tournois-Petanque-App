import { Terrain } from './terrain';

export interface Match {
  id: number;
  score1: number;
  score2: number;
  manche: number;
  mancheName: string;
  equipe: [[number, number, number], [number, number, number]];
  terrain: Terrain;
}
