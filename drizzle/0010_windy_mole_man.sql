CREATE TABLE `joueurs_suggestion` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`occurence` integer NOT NULL,
	`cacher` integer DEFAULT false
);
