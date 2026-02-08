CREATE TABLE `equipes_joueurs` (
	`id` integer PRIMARY KEY NOT NULL,
	`joueur_id` integer NOT NULL,
	`equipe_id` integer NOT NULL,
	FOREIGN KEY (`joueur_id`) REFERENCES `joueurs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`equipe_id`) REFERENCES `equipe`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_match` (
	`id` integer PRIMARY KEY NOT NULL,
	`match_id` integer NOT NULL,
	`tournoi_id` integer NOT NULL,
	`tour_id` integer NOT NULL,
	`tour_name` text,
	`equipe1_id` integer NOT NULL,
	`equipe2_id` integer NOT NULL,
	`score1` integer,
	`score2` integer,
	`terrain_id` integer,
	`updated_at` integer,
	`synced` integer DEFAULT 0,
	FOREIGN KEY (`tournoi_id`) REFERENCES `tournoi`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`equipe1_id`) REFERENCES `equipe`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`equipe2_id`) REFERENCES `equipe`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`terrain_id`) REFERENCES `terrains`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_match`("id", "match_id", "tournoi_id", "tour_id", "tour_name", "equipe1_id", "equipe2_id", "score1", "score2", "terrain_id", "updated_at", "synced") SELECT "id", "match_id", "tournoi_id", "tour_id", "tour_name", "equipe1_id", "equipe2_id", "score1", "score2", "terrain_id", "updated_at", "synced" FROM `match`;--> statement-breakpoint
DROP TABLE `match`;--> statement-breakpoint
ALTER TABLE `__new_match` RENAME TO `match`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_equipe` (
	`id` integer PRIMARY KEY NOT NULL,
	`equipe_id` integer NOT NULL,
	`updated_at` integer,
	`synced` integer DEFAULT 0
);
--> statement-breakpoint
INSERT INTO `__new_equipe`("id", "equipe_id", "updated_at", "synced") SELECT "id", "equipe_id", "updated_at", "synced" FROM `equipe`;--> statement-breakpoint
DROP TABLE `equipe`;--> statement-breakpoint
ALTER TABLE `__new_equipe` RENAME TO `equipe`;--> statement-breakpoint
CREATE TABLE `__new_terrains_preparation_tournois` (
	`id` integer PRIMARY KEY NOT NULL,
	`terrain_id` integer NOT NULL,
	`preparation_tournoi_id` integer NOT NULL,
	FOREIGN KEY (`terrain_id`) REFERENCES `terrains`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`preparation_tournoi_id`) REFERENCES `preparation_tournoi`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_terrains_preparation_tournois`("id", "terrain_id", "preparation_tournoi_id") SELECT "id", "terrain_id", "preparation_tournoi_id" FROM `terrains_preparation_tournois`;--> statement-breakpoint
DROP TABLE `terrains_preparation_tournois`;--> statement-breakpoint
ALTER TABLE `__new_terrains_preparation_tournois` RENAME TO `terrains_preparation_tournois`;