CREATE TABLE `joueurs` (
	`id` integer PRIMARY KEY NOT NULL,
	`joueur_id` text,
	`name` text,
	`type` text,
	`equipe` text
);
--> statement-breakpoint
CREATE TABLE `joueurs_listes` (
	`id` integer PRIMARY KEY NOT NULL,
	`joueur_id` integer,
	`liste_id` integer,
	FOREIGN KEY (`joueur_id`) REFERENCES `joueurs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`liste_id`) REFERENCES `listes_joueurs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `listes_joueurs` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`updated_at` integer,
	`synced` integer DEFAULT 0
);
