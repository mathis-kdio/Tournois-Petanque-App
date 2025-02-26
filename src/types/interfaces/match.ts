import { Terrain } from './terrain';

export interface Match {
  id: number;
  score1: number | undefined;
  score2: number | undefined;
  manche: number;
  mancheName: string;
  equipe: [[number, number, number], [number, number, number]];
  terrain: Terrain;
}
