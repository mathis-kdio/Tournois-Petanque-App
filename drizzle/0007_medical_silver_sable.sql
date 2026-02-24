CREATE TABLE `terrains_preparation_tournois` (
	`id` integer PRIMARY KEY NOT NULL,
	`terrain_id` integer,
	`preparation_tournoi_id` integer,
	FOREIGN KEY (`terrain_id`) REFERENCES `terrains`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`preparation_tournoi_id`) REFERENCES `preparation_tournoi`(`id`) ON UPDATE no action ON DELETE no action
);
