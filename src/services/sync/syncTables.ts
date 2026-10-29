/**
 * Registre unique des tables synchronisées.
 *
 * Chaque entrée associe, pour une table :
 *  - `table`      : la table Drizzle SQLite (accès colonnes, insert/update/delete) ;
 *  - `pgTable`    : le nom de la table Postgres (clé utilisée par supabase-js) ;
 *  - `toPostgres` / `fromPostgres` : les conversions de lignes.
 *
 * PUSH_ORDER : parents d'abord — utilisé pour le push, l'application du pull
 * (les inserts enfant exigent leurs parents déjà présents) et les purges.
 * PULL_ORDER : dérivé (reverse) — réservé aux suppressions (enfants d'abord).
 *
 * Tables non synchronisées (état transitoire) — absentes :
 *   preparation_tournoi, joueurs_preparation_tournois, terrains_preparation_tournois
 */

import {
  equipe,
  equipesJoueurs,
  Equipe,
  NewEquipe,
  EquipesJoueurs,
  NewEquipesJoueurs,
  joueurs,
  joueursListes,
  joueursSuggestion,
  Joueur,
  NewJoueur,
  JoueursListes,
  NewJoueursListes,
  JoueursSuggestion,
  NewJoueursSuggestion,
  listesJoueurs,
  ListesJoueurs,
  NewListesJoueurs,
  match,
  Match,
  NewMatch,
  NewTerrain,
  Terrain,
  terrains,
  NewTournoi,
  Tournoi,
  tournoi,
} from '@/db/schema';
import {
  equipeFromPostgres,
  equipeToPostgres,
  EquipePostgresRow,
} from './syncMappers/equipeMapper';
import {
  equipesJoueursFromPostgres,
  equipesJoueursToPostgres,
  EquipesJoueursPostgresRow,
} from './syncMappers/equipesJoueursMapper';
import {
  joueursFromPostgres,
  joueursToPostgres,
  JoueursPostgresRow,
} from './syncMappers/joueursMapper';
import {
  joueursListesFromPostgres,
  joueursListesToPostgres,
  JoueursListesPostgresRow,
} from './syncMappers/joueursListesMapper';
import {
  joueursSuggestionFromPostgres,
  joueursSuggestionToPostgres,
  JoueursSuggestionPostgresRow,
} from './syncMappers/joueursSuggestionMapper';
import {
  listesJoueursFromPostgres,
  listesJoueursToPostgres,
  ListesJoueursPostgresRow,
} from './syncMappers/listesJoueursMapper';
import {
  matchFromPostgres,
  matchToPostgres,
  MatchPostgresRow,
} from './syncMappers/matchMapper';
import {
  terrainsFromPostgres,
  terrainsToPostgres,
  TerrainsPostgresRow,
} from './syncMappers/terrainsMapper';
import {
  tournoiFromPostgres,
  tournoiToPostgres,
  TournoiPostgresRow,
} from './syncMappers/tournoiMapper';

export interface SyncMapper<
  TSqlite,
  TNewSqlite,
  TPostgres extends {
    id: string;
    user_id: string;
    updated_at: string;
    deleted: boolean;
    deleted_at: string | null;
    server_updated_at: string;
  },
> {
  /** Table Drizzle SQLite (colonnes, insert/update/delete). */
  table: any;
  /** Nom de la table Postgres (utilisé par supabase-js `.from(name)`). */
  pgTable: string;
  toPostgres: (
    row: TSqlite,
    userId: string,
  ) => Omit<TPostgres, 'deleted_at' | 'server_updated_at'>;
  fromPostgres: (row: TPostgres) => TNewSqlite;
}

export const SYNC_TABLES = {
  joueurs_suggestion: {
    table: joueursSuggestion,
    pgTable: 'joueurs_suggestion',
    toPostgres: joueursSuggestionToPostgres,
    fromPostgres: joueursSuggestionFromPostgres,
  } as SyncMapper<
    JoueursSuggestion,
    NewJoueursSuggestion,
    JoueursSuggestionPostgresRow
  >,

  joueurs: {
    table: joueurs,
    pgTable: 'joueurs',
    toPostgres: joueursToPostgres,
    fromPostgres: joueursFromPostgres,
  } as SyncMapper<Joueur, NewJoueur, JoueursPostgresRow>,

  listes_joueurs: {
    table: listesJoueurs,
    pgTable: 'listes_joueurs',
    toPostgres: listesJoueursToPostgres,
    fromPostgres: listesJoueursFromPostgres,
  } as SyncMapper<ListesJoueurs, NewListesJoueurs, ListesJoueursPostgresRow>,

  terrains: {
    table: terrains,
    pgTable: 'terrains',
    toPostgres: terrainsToPostgres,
    fromPostgres: terrainsFromPostgres,
  } as SyncMapper<Terrain, NewTerrain, TerrainsPostgresRow>,

  tournoi: {
    table: tournoi,
    pgTable: 'tournoi',
    toPostgres: tournoiToPostgres,
    fromPostgres: tournoiFromPostgres,
  } as SyncMapper<Tournoi, NewTournoi, TournoiPostgresRow>,

  equipe: {
    table: equipe,
    pgTable: 'equipe',
    toPostgres: equipeToPostgres,
    fromPostgres: equipeFromPostgres,
  } as SyncMapper<Equipe, NewEquipe, EquipePostgresRow>,

  equipes_joueurs: {
    table: equipesJoueurs,
    pgTable: 'equipes_joueurs',
    toPostgres: equipesJoueursToPostgres,
    fromPostgres: equipesJoueursFromPostgres,
  } as SyncMapper<EquipesJoueurs, NewEquipesJoueurs, EquipesJoueursPostgresRow>,

  joueurs_listes: {
    table: joueursListes,
    pgTable: 'joueurs_listes',
    toPostgres: joueursListesToPostgres,
    fromPostgres: joueursListesFromPostgres,
  } as SyncMapper<JoueursListes, NewJoueursListes, JoueursListesPostgresRow>,

  match: {
    table: match,
    pgTable: 'match',
    toPostgres: matchToPostgres,
    fromPostgres: matchFromPostgres,
  } as SyncMapper<Match, NewMatch, MatchPostgresRow>,
} as const;

export type SyncTableName = keyof typeof SYNC_TABLES;

/** Ordre parents d'abord (push, application du pull, purges). */
export const PUSH_ORDER = [
  'joueurs_suggestion',
  'joueurs',
  'listes_joueurs',
  'terrains',
  'tournoi',
  'joueurs_listes',
  'equipe',
  'equipes_joueurs',
  'match',
] as const satisfies readonly SyncTableName[];

/** Ordre inverse (enfants d'abord) — dérivé, plus de liste manuelle à synchroniser. */
export const PULL_ORDER = [...PUSH_ORDER].reverse() as unknown as [
  SyncTableName,
  ...SyncTableName[],
];
