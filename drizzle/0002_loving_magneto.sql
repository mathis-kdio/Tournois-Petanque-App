CREATE TABLE `equipe` (
	`id` integer PRIMARY KEY NOT NULL,
	`equipe_id` integer,
	`joueur_id` integer,
	`updated_at` integer,
	`synced` integer DEFAULT 0,
	FOREIGN KEY (`joueur_id`) REFERENCES `joueurs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `match` (
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
	FOREIGN KEY (`terrain_id`) REFERENCES `terrain`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `preparationTournoi` (
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
CREATE TABLE `terrain` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`updated_at` integer,
	`synced` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `tournoi` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`option1` text,
	`option2` text,
	`option3` text,
	`updated_at` integer,
	`synced` integer DEFAULT 0
);
