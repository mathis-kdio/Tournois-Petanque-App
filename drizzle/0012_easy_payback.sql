PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_preparation_tournoi` (
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
	`avecTerrains` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_preparation_tournoi`("id", "nbTours", "nbPtVictoire", "speciauxIncompatibles", "memesEquipes", "memesAdversaires", "typeTournoi", "typeEquipes", "mode", "modeCreationEquipes", "complement", "avecTerrains") SELECT "id", "nbTours", "nbPtVictoire", "speciauxIncompatibles", "memesEquipes", "memesAdversaires", "typeTournoi", "typeEquipes", "mode", "modeCreationEquipes", "complement", "avecTerrains" FROM `preparation_tournoi`;--> statement-breakpoint
DROP TABLE `preparation_tournoi`;--> statement-breakpoint
ALTER TABLE `__new_preparation_tournoi` RENAME TO `preparation_tournoi`;--> statement-breakpoint
PRAGMA foreign_keys=ON;