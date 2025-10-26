CREATE TABLE `joueurs_prepration_tournois` (
	`id` integer PRIMARY KEY NOT NULL,
	`joueur_id` integer,
	`preparation_tournoi_id` integer,
	FOREIGN KEY (`joueur_id`) REFERENCES `joueurs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`preparation_tournoi_id`) REFERENCES `preparation_tournoi`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `joueurs_tournois` (
	`id` integer PRIMARY KEY NOT NULL,
	`joueur_id` integer,
	`tournoi_id` integer,
	FOREIGN KEY (`joueur_id`) REFERENCES `joueurs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tournoi_id`) REFERENCES `tournoi`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `preparation_tournoi` (
	`id` integer PRIMARY KEY NOT NULL,
	`nbTours` integer,
	`nbPtVictoire` integer,
	`speciauxIncompatibles` integer,
	`memesEquipes` integer,
	`memesAdversaires` integer,
	`typeTournoi` text,
	`typeEquipes` text,
	`mode` text,
	`modeCreationEquipes` text,
	`complement` text,
	`avecTerrains` integer
);
--> statement-breakpoint
CREATE TABLE `terrains` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`updated_at` integer,
	`synced` integer DEFAULT 0
);
--> statement-breakpoint
DROP TABLE `preparationTournoi`;--> statement-breakpoint
DROP TABLE `terrain`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_match` (
	`id` integer PRIMARY KEY NOT NULL,
	`match_id` integer,
	`tournoi_id` integer,
	`tour` text,
	`equipe1_id` integer,
	`equipe2_id` integer,
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
INSERT INTO `__new_match`("id", "match_id", "tournoi_id", "tour", "equipe1_id", "equipe2_id", "score1", "score2", "terrain_id", "updated_at", "synced") SELECT "id", "match_id", "tournoi_id", "tour", "equipe1_id", "equipe2_id", "score1", "score2", "terrain_id", "updated_at", "synced" FROM `match`;--> statement-breakpoint
DROP TABLE `match`;--> statement-breakpoint
ALTER TABLE `__new_match` RENAME TO `match`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_joueurs` (
	`id` integer PRIMARY KEY NOT NULL,
	`joueur_id` integer NOT NULL,
	`name` text NOT NULL,
	`type` text,
	`equipe` integer,
	`isChecked` integer
);
--> statement-breakpoint
INSERT INTO `__new_joueurs`("id", "joueur_id", "name", "type", "equipe", "isChecked") SELECT "id", "joueur_id", "name", "type", "equipe", "isChecked" FROM `joueurs`;--> statement-breakpoint
DROP TABLE `joueurs`;--> statement-breakpoint
ALTER TABLE `__new_joueurs` RENAME TO `joueurs`;