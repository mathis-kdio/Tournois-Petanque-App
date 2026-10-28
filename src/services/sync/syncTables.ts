/**
 * Registre ordonné des tables synchronisées.
 *
 * PUSH_ORDER : parents d'abord — utilisé pour le push, pour l'application du
 * pull (les inserts enfants exigent leurs parents déjà présents) et pour les
 * purges. PULL_ORDER : ordre inverse — réservé aux suppressions (enfants
 * d'abord) et aux lectures.
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
