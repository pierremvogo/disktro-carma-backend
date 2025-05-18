CREATE TABLE `artist_admins` (
	`id` varchar(21) NOT NULL,
	`artist_id` varchar(21) NOT NULL,
	`user_id` varchar(21) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artist_admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `artist_admins_artist_user_idx` UNIQUE(`artist_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `artist_tags` (
	`id` varchar(21) NOT NULL,
	`artist_id` varchar(21) NOT NULL,
	`tag_id` varchar(21) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artist_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `artist_tag_unique_idx` UNIQUE(`artist_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `artists` (
	`id` varchar(21) NOT NULL,
	`name` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`url` varchar(256),
	`location` varchar(256),
	`profile_image_url` varchar(256),
	`biography` varchar(256),
	`spotify_artist_link` varchar(256),
	`deezer_artist_link` varchar(256),
	`tidal_artist_link` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artists_id` PRIMARY KEY(`id`),
	CONSTRAINT `artists_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `artists_spotify_artist_link_unique` UNIQUE(`spotify_artist_link`),
	CONSTRAINT `artists_deezer_artist_link_unique` UNIQUE(`deezer_artist_link`),
	CONSTRAINT `artists_tidal_artist_link_unique` UNIQUE(`tidal_artist_link`),
	CONSTRAINT `artist_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `collection_artists` (
	`id` varchar(21) NOT NULL,
	`artist_id` varchar(21) NOT NULL,
	`collection_id` varchar(21) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collection_artists_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_artist_collection` UNIQUE(`artist_id`,`collection_id`)
);
--> statement-breakpoint
CREATE TABLE `collection_tags` (
	`id` varchar(21) NOT NULL,
	`collection_id` varchar(21) NOT NULL,
	`tag_id` varchar(21) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `collection_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `collection_tag_unique_idx` UNIQUE(`collection_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`id` varchar(21) NOT NULL,
	`title` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`duration` int,
	`cover_url` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collections_id` PRIMARY KEY(`id`),
	CONSTRAINT `collections_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `release` (
	`id` varchar(21) NOT NULL,
	`artist_id` varchar(21) NOT NULL,
	`title` varchar(256) NOT NULL,
	`release_date` varchar(256),
	`description` varchar(256),
	`covert_art` varchar(256),
	`label` varchar(256) NOT NULL,
	`release_type` varchar(256),
	`format` varchar(256),
	`upc_code` varchar(256),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `release_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` varchar(21) NOT NULL,
	`name` varchar(256) NOT NULL,
	`slug` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `track_artists` (
	`id` varchar(21) NOT NULL,
	`artist_id` varchar(21) NOT NULL,
	`track_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `track_artists_id` PRIMARY KEY(`id`),
	CONSTRAINT `artist_track_unique` UNIQUE(`artist_id`,`track_id`)
);
--> statement-breakpoint
CREATE TABLE `track_collections` (
	`id` varchar(21) NOT NULL,
	`collection_id` varchar(21) NOT NULL,
	`track_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `track_collections_id` PRIMARY KEY(`id`),
	CONSTRAINT `collection_track_unique_idx` UNIQUE(`collection_id`,`track_id`)
);
--> statement-breakpoint
CREATE TABLE `track_tags` (
	`id` varchar(21) NOT NULL,
	`track_id` varchar(21) NOT NULL,
	`tag_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `track_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `track_tag_unique_idx` UNIQUE(`track_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `tracks` (
	`id` varchar(21) NOT NULL,
	`title` varchar(256),
	`slug` varchar(256) NOT NULL,
	`duration` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tracks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(21) NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(256) NOT NULL,
	`password` varchar(256) NOT NULL,
	`type` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_password_unique` UNIQUE(`password`),
	CONSTRAINT `email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `artist_admins` ADD CONSTRAINT `artist_admins_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artist_admins` ADD CONSTRAINT `artist_admins_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artist_tags` ADD CONSTRAINT `artist_tags_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artist_tags` ADD CONSTRAINT `artist_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collection_artists` ADD CONSTRAINT `collection_artists_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collection_artists` ADD CONSTRAINT `collection_artists_collection_id_collections_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collection_tags` ADD CONSTRAINT `collection_tags_collection_id_collections_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collection_tags` ADD CONSTRAINT `collection_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `release` ADD CONSTRAINT `release_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_artists` ADD CONSTRAINT `track_artists_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_artists` ADD CONSTRAINT `track_artists_track_id_tracks_id_fk` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_collections` ADD CONSTRAINT `track_collections_collection_id_collections_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_collections` ADD CONSTRAINT `track_collections_track_id_tracks_id_fk` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_tags` ADD CONSTRAINT `track_tags_track_id_tracks_id_fk` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_tags` ADD CONSTRAINT `track_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `collection_slug_idx` ON `collections` (`slug`);--> statement-breakpoint
CREATE INDEX `tag_slug_idx` ON `tags` (`slug`);--> statement-breakpoint
CREATE INDEX `track_slug_idx` ON `tracks` (`slug`);