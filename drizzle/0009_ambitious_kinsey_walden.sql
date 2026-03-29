DROP TABLE `joueurs_tournois`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_joueurs_listes` (
	`id` integer PRIMARY KEY NOT NULL,
	`joueur_id` integer NOT NULL,
	`liste_id` integer NOT NULL,
	FOREIGN KEY (`joueur_id`) REFERENCES `joueurs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`liste_id`) REFERENCES `listes_joueurs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_joueurs_listes`("id", "joueur_id", "liste_id") SELECT "id", "joueur_id", "liste_id" FROM `joueurs_listes`;--> statement-breakpoint
DROP TABLE `joueurs_listes`;--> statement-breakpoint
ALTER TABLE `__new_joueurs_listes` RENAME TO `joueurs_listes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_joueurs_preparation_tournois` (
	`id` integer PRIMARY KEY NOT NULL,
	`joueur_id` integer NOT NULL,
	`preparation_tournoi_id` integer NOT NULL,
	FOREIGN KEY (`joueur_id`) REFERENCES `joueurs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`preparation_tournoi_id`) REFERENCES `preparation_tournoi`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_joueurs_preparation_tournois`("id", "joueur_id", "preparation_tournoi_id") SELECT "id", "joueur_id", "preparation_tournoi_id" FROM `joueurs_preparation_tournois`;--> statement-breakpoint
DROP TABLE `joueurs_preparation_tournois`;--> statement-breakpoint
ALTER TABLE `__new_joueurs_preparation_tournois` RENAME TO `joueurs_preparation_tournois`;--> statement-breakpoint
ALTER TABLE `tournoi` ADD `estTournoiActuel` integer NOT NULL;