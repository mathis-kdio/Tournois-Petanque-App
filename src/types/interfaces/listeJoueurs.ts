import { JoueurModel } from './joueurModel';

export type ListeJoueurs = (JoueurModel[] | ListeJoueursInfos)[];

export interface ListeJoueursInfos {
  listId: number;
  name: string | null;
}
