PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tournoi` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`nbTours` integer NOT NULL,
	`nbMatchs` integer NOT NULL,
	`nbPtVictoire` integer NOT NULL,
	`speciauxIncompatibles` integer NOT NULL,
	`memesEquipes` integer NOT NULL,
	`memesAdversaires` integer NOT NULL,
	`typeEquipes` text NOT NULL,
	`typeTournoi` text NOT NULL,
	`avecTerrains` integer NOT NULL,
	`mode` text NOT NULL,
	`create_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tournoi`("id", "name", "nbTours", "nbMatchs", "nbPtVictoire", "speciauxIncompatibles", "memesEquipes", "memesAdversaires", "typeEquipes", "typeTournoi", "avecTerrains", "mode", "create_at", "updated_at") SELECT "id", "name", "nbTours", "nbMatchs", "nbPtVictoire", "speciauxIncompatibles", "memesEquipes", "memesAdversaires", "typeEquipes", "typeTournoi", "avecTerrains", "mode", "create_at", "updated_at" FROM `tournoi`;--> statement-breakpoint
DROP TABLE `tournoi`;--> statement-breakpoint
ALTER TABLE `__new_tournoi` RENAME TO `tournoi`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_joueurs` (
	`id` integer PRIMARY KEY NOT NULL,
	`joueur_id` integer NOT NULL,
	`name` text NOT NULL,
	`type` text,
	`equipe` integer,
	`isChecked` integer DEFAULT false
);
--> statement-breakpoint
INSERT INTO `__new_joueurs`("id", "joueur_id", "name", "type", "equipe", "isChecked") SELECT "id", "joueur_id", "name", "type", "equipe", "isChecked" FROM `joueurs`;--> statement-breakpoint
DROP TABLE `joueurs`;--> statement-breakpoint
ALTER TABLE `__new_joueurs` RENAME TO `joueurs`;