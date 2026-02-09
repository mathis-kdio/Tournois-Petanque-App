import { JoueurModel } from './joueurModel';

export interface ListeJoueurs extends Array<JoueurModel[] | ListeJoueursInfos> {}

export interface ListeJoueursInfos {
  listId: number;
  name: string | null;
}
