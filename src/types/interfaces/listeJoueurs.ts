import { Joueur } from './joueur';

export interface ListeJoueurs extends Array<Joueur[] | ListeJoueursInfos> {}

export interface ListeJoueursInfos {
  listId: number;
  name: string | null;
}
