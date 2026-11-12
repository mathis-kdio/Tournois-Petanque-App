import { JoueurModel } from './joueurModel';

export type ListeJoueurs = (JoueurModel[] | ListeJoueursInfos)[];

export interface ListeJoueursInfos {
  listId: string;
  name: string | null;
}
