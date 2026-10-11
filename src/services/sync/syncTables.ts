/**
 * Registre ordonné des tables synchronisées.
 *
 * PUSH_ORDER : parents d'abord (les FK doivent exister avant les enfants).
 * PULL_ORDER : ordre inverse (FK locales satisfaites à l'insert).
 *
 * Tables non synchronisées (état transitoire) — absentes :
 *   preparation_tournoi, joueurs_preparation_tournois, terrains_preparation_tournois
 */

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
] as const;

export const PULL_ORDER = [
  'match',
  'equipes_joueurs',
  'equipe',
  'joueurs_listes',
  'tournoi',
  'terrains',
  'listes_joueurs',
  'joueurs',
  'joueurs_suggestion',
] as const;

export type SyncTableName = (typeof PUSH_ORDER)[number];

/** Vérifie qu'un nom de table est bien une table synchronisée. */
export function isSyncTable(name: string): name is SyncTableName {
  return (PUSH_ORDER as readonly string[]).includes(name);
}
