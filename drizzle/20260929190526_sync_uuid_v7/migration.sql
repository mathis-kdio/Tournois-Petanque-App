-- Migration Drizzle : ajout des colonnes de sync (synced, updated_at, deleted) et de la table sync_state.
--
-- IMPORTANT : Le changement de type des clés primaires (integer → text/UUID v7) et le remapping
-- des FK sont gérés par `runUuidMigration.ts` (migration programmatique), car ils nécessitent
-- la génération d'UUID v7 et la réécriture des FK via une table de mapping — impossible en SQL pur.
--
-- Cette migration Drizzle ne fait donc que :
--   1. Créer la table `sync_state` ;
--   2. Ajouter les colonnes `synced`, `updated_at`, `deleted` manquantes sur les tables existantes.
--
-- Le snapshot Drizzle reflète le schéma final (IDs text), ce qui empêche `drizzle-kit generate`
-- de régénérer ces changements. La conversion effective des IDs est assurée par `runUuidMigration`.
CREATE TABLE `sync_state` (
	`user_id` text PRIMARY KEY,
	`last_pulled_at` integer,
	`clock_offset` integer,
	`purged_at` integer
);
--> statement-breakpoint
ALTER TABLE `equipe` ADD `deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `equipes_joueurs` ADD `synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `equipes_joueurs` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `equipes_joueurs` ADD `deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `joueurs` ADD `synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `joueurs` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `joueurs` ADD `deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `joueurs_listes` ADD `synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `joueurs_listes` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `joueurs_listes` ADD `deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `joueurs_preparation_tournois` ADD `synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `joueurs_preparation_tournois` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `joueurs_preparation_tournois` ADD `deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `joueurs_suggestion` ADD `synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `joueurs_suggestion` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `joueurs_suggestion` ADD `deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `listes_joueurs` ADD `deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `match` ADD `deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `preparation_tournoi` ADD `synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `preparation_tournoi` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `preparation_tournoi` ADD `deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `terrains` ADD `deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `terrains_preparation_tournois` ADD `synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `terrains_preparation_tournois` ADD `updated_at` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `terrains_preparation_tournois` ADD `deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `tournoi` ADD `synced` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `tournoi` ADD `deleted` integer DEFAULT false NOT NULL;