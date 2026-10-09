/**
 * Registre central des mappers de synchronisation.
 *
 * Chaque entrée associe le nom de table Postgres (clé utilisée par le moteur
 * de sync) aux fonctions de conversion SQLite ↔ Postgres et au nom de table
 * SQLite correspondant.
 *
 * L'ordre n'a pas d'importance ici — c'est `syncTables.ts` (PUSH_ORDER) qui
 * définit l'ordre de dépendance FK.
 */

import { Equipe, NewEquipe } from '@/db/schema';
import { EquipesJoueurs, NewEquipesJoueurs } from '@/db/schema';
import { Joueur, NewJoueur } from '@/db/schema';
import { JoueursListes, NewJoueursListes } from '@/db/schema';
import { JoueursSuggestion, NewJoueursSuggestion } from '@/db/schema';
import { ListesJoueurs, NewListesJoueurs } from '@/db/schema';
import { Match, NewMatch } from '@/db/schema';
import { NewTerrain, Terrain } from '@/db/schema';
import { NewTournoi, Tournoi } from '@/db/schema';

import { equipeFromPostgres, equipeToPostgres, EquipePostgresRow } from './equipeMapper';
import {
  equipesJoueursFromPostgres,
  equipesJoueursToPostgres,
  EquipesJoueursPostgresRow,
} from './equipesJoueursMapper';
import {
  joueursFromPostgres,
  joueursToPostgres,
  JoueursPostgresRow,
} from './joueursMapper';
import {
  joueursListesFromPostgres,
  joueursListesToPostgres,
  JoueursListesPostgresRow,
} from './joueursListesMapper';
import {
  joueursSuggestionFromPostgres,
  joueursSuggestionToPostgres,
  JoueursSuggestionPostgresRow,
} from './joueursSuggestionMapper';
import {
  listesJoueursFromPostgres,
  listesJoueursToPostgres,
  ListesJoueursPostgresRow,
} from './listesJoueursMapper';
import {
  matchFromPostgres,
  matchToPostgres,
  MatchPostgresRow,
} from './matchMapper';
import {
  terrainsFromPostgres,
  terrainsToPostgres,
  TerrainsPostgresRow,
} from './terrainsMapper';
import {
  tournoiFromPostgres,
  tournoiToPostgres,
  TournoiPostgresRow,
} from './tournoiMapper';

export interface SyncMapper<
  TSqlite,
  TNewSqlite,
  TPostgres extends { id: string; user_id: string; updated_at: string; deleted: boolean; deleted_at: string | null; server_updated_at: string },
> {
  /** Nom de la table Postgres (utilisé par supabase-js `.from(name)`). */
  pgTable: string;
  toPostgres: (row: TSqlite, userId: string) => Omit<TPostgres, 'deleted_at' | 'server_updated_at'>;
  fromPostgres: (row: TPostgres) => TNewSqlite;
}

export const SYNC_MAPPERS = {
  joueurs_suggestion: {
    pgTable: 'joueurs_suggestion',
    toPostgres: joueursSuggestionToPostgres,
    fromPostgres: joueursSuggestionFromPostgres,
  } as SyncMapper<JoueursSuggestion, NewJoueursSuggestion, JoueursSuggestionPostgresRow>,

  joueurs: {
    pgTable: 'joueurs',
    toPostgres: joueursToPostgres,
    fromPostgres: joueursFromPostgres,
  } as SyncMapper<Joueur, NewJoueur, JoueursPostgresRow>,

  listes_joueurs: {
    pgTable: 'listes_joueurs',
    toPostgres: listesJoueursToPostgres,
    fromPostgres: listesJoueursFromPostgres,
  } as SyncMapper<ListesJoueurs, NewListesJoueurs, ListesJoueursPostgresRow>,

  terrains: {
    pgTable: 'terrains',
    toPostgres: terrainsToPostgres,
    fromPostgres: terrainsFromPostgres,
  } as SyncMapper<Terrain, NewTerrain, TerrainsPostgresRow>,

  tournoi: {
    pgTable: 'tournoi',
    toPostgres: tournoiToPostgres,
    fromPostgres: tournoiFromPostgres,
  } as SyncMapper<Tournoi, NewTournoi, TournoiPostgresRow>,

  equipe: {
    pgTable: 'equipe',
    toPostgres: equipeToPostgres,
    fromPostgres: equipeFromPostgres,
  } as SyncMapper<Equipe, NewEquipe, EquipePostgresRow>,

  equipes_joueurs: {
    pgTable: 'equipes_joueurs',
    toPostgres: equipesJoueursToPostgres,
    fromPostgres: equipesJoueursFromPostgres,
  } as SyncMapper<EquipesJoueurs, NewEquipesJoueurs, EquipesJoueursPostgresRow>,

  joueurs_listes: {
    pgTable: 'joueurs_listes',
    toPostgres: joueursListesToPostgres,
    fromPostgres: joueursListesFromPostgres,
  } as SyncMapper<JoueursListes, NewJoueursListes, JoueursListesPostgresRow>,

  match: {
    pgTable: 'match',
    toPostgres: matchToPostgres,
    fromPostgres: matchFromPostgres,
  } as SyncMapper<Match, NewMatch, MatchPostgresRow>,
} as const;

export type SyncTableName = keyof typeof SYNC_MAPPERS;
