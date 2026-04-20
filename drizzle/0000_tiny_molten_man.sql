CREATE TABLE `equipe` (
	`id` integer PRIMARY KEY NOT NULL,
	`equipe_id` integer NOT NULL,
	`updated_at` integer,
	`synced` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `equipes_joueurs` (
	`id` integer PRIMARY KEY NOT NULL,
	`joueur_id` integer NOT NULL,
	`equipe_id` integer NOT NULL,
	FOREIGN KEY (`joueur_id`) REFERENCES `joueurs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`equipe_id`) REFERENCES `equipe`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `joueurs` (
	`id` integer PRIMARY KEY NOT NULL,
	`joueur_id` integer NOT NULL,
	`name` text NOT NULL,
	`type` text,
	`equipe` integer,
	`isChecked` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `joueurs_listes` (
	`id` integer PRIMARY KEY NOT NULL,
	`joueur_id` integer NOT NULL,
	`liste_id` integer NOT NULL,
	FOREIGN KEY (`joueur_id`) REFERENCES `joueurs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`liste_id`) REFERENCES `listes_joueurs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `joueurs_preparation_tournois` (
	`id` integer PRIMARY KEY NOT NULL,
	`joueur_id` integer NOT NULL,
	`preparation_tournoi_id` integer NOT NULL,
	FOREIGN KEY (`joueur_id`) REFERENCES `joueurs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`preparation_tournoi_id`) REFERENCES `preparation_tournoi`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `joueurs_suggestion` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`occurence` integer NOT NULL,
	`cacher` integer DEFAULT false
);
--> statement-breakpoint
CREATE UNIQUE INDEX `nameUniqueIndex` ON `joueurs_suggestion` (`name`);--> statement-breakpoint
CREATE TABLE `listes_joueurs` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`updated_at` integer,
	`synced` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `match` (
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
	`avecTerrains` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `terrains` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`updated_at` integer,
	`synced` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `terrains_preparation_tournois` (
	`id` integer PRIMARY KEY NOT NULL,
	`terrain_id` integer NOT NULL,
	`preparation_tournoi_id` integer NOT NULL,
	FOREIGN KEY (`terrain_id`) REFERENCES `terrains`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`preparation_tournoi_id`) REFERENCES `preparation_tournoi`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tournoi` (
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
	`estTournoiActuel` integer NOT NULL,
	`create_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
