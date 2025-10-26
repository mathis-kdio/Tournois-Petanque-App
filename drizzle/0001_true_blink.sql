PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_joueurs` (
	`id` integer PRIMARY KEY NOT NULL,
	`joueur_id` integer,
	`name` text,
	`type` text,
	`equipe` integer
);
--> statement-breakpoint
INSERT INTO `__new_joueurs`("id", "joueur_id", "name", "type", "equipe") SELECT "id", "joueur_id", "name", "type", "equipe" FROM `joueurs`;--> statement-breakpoint
DROP TABLE `joueurs`;--> statement-breakpoint
ALTER TABLE `__new_joueurs` RENAME TO `joueurs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_listes_joueurs` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`updated_at` integer,
	`synced` integer DEFAULT 0
);
--> statement-breakpoint
INSERT INTO `__new_listes_joueurs`("id", "name", "updated_at", "synced") SELECT "id", "name", "updated_at", "synced" FROM `listes_joueurs`;--> statement-breakpoint
DROP TABLE `listes_joueurs`;--> statement-breakpoint
ALTER TABLE `__new_listes_joueurs` RENAME TO `listes_joueurs`;