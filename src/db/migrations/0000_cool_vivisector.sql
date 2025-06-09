CREATE TABLE `album_artists` (
	`id` varchar(21) NOT NULL,
	`artist_id` varchar(21) NOT NULL,
	`album_id` varchar(21) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `album_artists_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_artist_album` UNIQUE(`artist_id`,`album_id`)
);
--> statement-breakpoint
CREATE TABLE `album_tags` (
	`id` varchar(21) NOT NULL,
	`album_id` varchar(21) NOT NULL,
	`tag_id` varchar(21) NOT NULL,
	CONSTRAINT `album_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `album_tag_unique_idx` UNIQUE(`album_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `albums` (
	`id` varchar(21) NOT NULL,
	`title` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`duration` int,
	`cover_url` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `albums_id` PRIMARY KEY(`id`),
	CONSTRAINT `albums_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
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
CREATE TABLE `plans` (
	`id` varchar(21) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'EUR',
	`billing_cycle` varchar(20) NOT NULL DEFAULT 'monthly',
	`active` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plans_id` PRIMARY KEY(`id`)
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
	`status` varchar(256),
	`MessageId` varchar(256),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `release_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` varchar(21) NOT NULL,
	`user_id` varchar(21) NOT NULL,
	`plan_id` varchar(21) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'active',
	`start_date` timestamp NOT NULL DEFAULT (now()),
	`end_date` timestamp,
	`stripeSessionId` varchar(255),
	`price` decimal(10,2) NOT NULL,
	`auto_renew` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_user_plan` UNIQUE(`user_id`,`plan_id`)
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
CREATE TABLE `track_albums` (
	`id` varchar(21) NOT NULL,
	`album_id` varchar(21) NOT NULL,
	`track_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `track_albums_id` PRIMARY KEY(`id`),
	CONSTRAINT `album_track_unique_idx` UNIQUE(`album_id`,`track_id`)
);
--> statement-breakpoint
CREATE TABLE `track_releases` (
	`id` varchar(21) NOT NULL,
	`track_id` varchar(21) NOT NULL,
	`release_id` varchar(21) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `track_releases_id` PRIMARY KEY(`id`),
	CONSTRAINT `track_release_unique` UNIQUE(`track_id`,`release_id`)
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
	`isrc_code` varchar(256) NOT NULL,
	`title` varchar(256),
	`slug` varchar(256) NOT NULL,
	`duration` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tracks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` varchar(21) NOT NULL,
	`user_id` varchar(21) NOT NULL,
	`subscription_id` varchar(21),
	`amount` decimal(10,2) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(21) NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(256) NOT NULL,
	`password` varchar(256) NOT NULL,
	`type` varchar(256),
	`isSubscribed` boolean NOT NULL DEFAULT false,
	`emailVerificationToken` varchar(256),
	`emailVerified` boolean NOT NULL DEFAULT false,
	`passwordResetToken` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_password_unique` UNIQUE(`password`),
	CONSTRAINT `email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `album_artists` ADD CONSTRAINT `album_artists_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `album_artists` ADD CONSTRAINT `album_artists_album_id_albums_id_fk` FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `album_tags` ADD CONSTRAINT `album_tags_album_id_albums_id_fk` FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `album_tags` ADD CONSTRAINT `album_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artist_admins` ADD CONSTRAINT `artist_admins_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artist_admins` ADD CONSTRAINT `artist_admins_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artist_tags` ADD CONSTRAINT `artist_tags_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artist_tags` ADD CONSTRAINT `artist_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `release` ADD CONSTRAINT `release_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_plan_id_plans_id_fk` FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_albums` ADD CONSTRAINT `track_albums_album_id_albums_id_fk` FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_albums` ADD CONSTRAINT `track_albums_track_id_tracks_id_fk` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_releases` ADD CONSTRAINT `track_releases_track_id_tracks_id_fk` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_releases` ADD CONSTRAINT `track_releases_release_id_release_id_fk` FOREIGN KEY (`release_id`) REFERENCES `release`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_tags` ADD CONSTRAINT `track_tags_track_id_tracks_id_fk` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_tags` ADD CONSTRAINT `track_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_subscription_id_subscriptions_id_fk` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `album_slug_idx` ON `albums` (`slug`);--> statement-breakpoint
CREATE INDEX `tag_slug_idx` ON `tags` (`slug`);--> statement-breakpoint
CREATE INDEX `track_slug_idx` ON `tracks` (`slug`);