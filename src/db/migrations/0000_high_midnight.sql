CREATE TABLE `album_artists` (
	`id` varchar(32) NOT NULL,
	`artist_id` varchar(32) NOT NULL,
	`album_id` varchar(32) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `album_artists_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_artist_album` UNIQUE(`artist_id`,`album_id`)
);
--> statement-breakpoint
CREATE TABLE `album_tags` (
	`id` varchar(32) NOT NULL,
	`album_id` varchar(32) NOT NULL,
	`tag_id` varchar(32) NOT NULL,
	CONSTRAINT `album_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `album_tag_unique_idx` UNIQUE(`album_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `albums` (
	`id` varchar(32) NOT NULL,
	`title` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`duration` int,
	`cover_url` varchar(256) NOT NULL,
	`authors` varchar(512),
	`producers` varchar(512),
	`lyricists` varchar(512),
	`musicians_vocals` varchar(512),
	`musicians_piano_keyboards` varchar(512),
	`musicians_winds` varchar(512),
	`musicians_percussion` varchar(512),
	`musicians_strings` varchar(512),
	`mixing_engineer` varchar(512),
	`mastering_engineer` varchar(512),
	`user_id` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `albums_id` PRIMARY KEY(`id`),
	CONSTRAINT `albums_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `artist_admins` (
	`id` varchar(32) NOT NULL,
	`artist_id` varchar(32) NOT NULL,
	`user_id` varchar(32) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artist_admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `artist_admins_artist_user_idx` UNIQUE(`artist_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `artist_payout_settings` (
	`id` varchar(32) NOT NULL,
	`artist_id` varchar(32) NOT NULL,
	`bank_account_holder` varchar(256),
	`bank_name` varchar(256),
	`account_number` varchar(128),
	`routing_number` varchar(64),
	`swift_code` varchar(32),
	`iban` varchar(64),
	`paypal_email` varchar(256),
	`bizum_phone` varchar(64),
	`mobile_money_provider` varchar(64),
	`mobile_money_phone` varchar(64),
	`orange_money_phone` varchar(64),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artist_payout_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `artist_payout_settings_artist_unique` UNIQUE(`artist_id`)
);
--> statement-breakpoint
CREATE TABLE `artist_tags` (
	`id` varchar(32) NOT NULL,
	`artist_id` varchar(32) NOT NULL,
	`tag_id` varchar(32) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artist_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `artist_tag_unique_idx` UNIQUE(`artist_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `artists` (
	`id` varchar(32) NOT NULL,
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
CREATE TABLE `editor_playlist_tracks` (
	`id` varchar(32) NOT NULL,
	`editor_playlist_id` varchar(32) NOT NULL,
	`track_id` varchar(32) NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `editor_playlist_tracks_id` PRIMARY KEY(`id`),
	CONSTRAINT `editor_playlist_track_unique` UNIQUE(`editor_playlist_id`,`track_id`)
);
--> statement-breakpoint
CREATE TABLE `editor_playlists` (
	`id` varchar(32) NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`cover_url` varchar(2048),
	`locale` varchar(16) NOT NULL DEFAULT 'en',
	`is_published` boolean NOT NULL DEFAULT false,
	`priority` int NOT NULL DEFAULT 0,
	`created_by_user_id` varchar(32),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `editor_playlists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ep_artists` (
	`id` varchar(32) NOT NULL,
	`artist_id` varchar(32) NOT NULL,
	`ep_id` varchar(32) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ep_artists_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_artist_ep` UNIQUE(`artist_id`,`ep_id`)
);
--> statement-breakpoint
CREATE TABLE `ep_tags` (
	`id` varchar(32) NOT NULL,
	`ep_id` varchar(32) NOT NULL,
	`tag_id` varchar(32) NOT NULL,
	CONSTRAINT `ep_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `ep_tag_unique_idx` UNIQUE(`ep_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `eps` (
	`id` varchar(32) NOT NULL,
	`title` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`duration` int,
	`cover_url` varchar(256) NOT NULL,
	`authors` varchar(512),
	`producers` varchar(512),
	`lyricists` varchar(512),
	`musicians_vocals` varchar(512),
	`musicians_piano_keyboards` varchar(512),
	`musicians_winds` varchar(512),
	`musicians_percussion` varchar(512),
	`musicians_strings` varchar(512),
	`mixing_engineer` varchar(512),
	`mastering_engineer` varchar(512),
	`user_id` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `eps_id` PRIMARY KEY(`id`),
	CONSTRAINT `eps_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `exclusive_contents` (
	`id` varchar(32) NOT NULL,
	`artist_id` varchar(32) NOT NULL,
	`type` varchar(16) NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`file_url` varchar(1024) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exclusive_contents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mood` (
	`id` varchar(32) NOT NULL,
	`name` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mood_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plans` (
	`id` varchar(32) NOT NULL,
	`artist_id` varchar(32) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'EUR',
	`billing_cycle` varchar(20) NOT NULL,
	`trial_days` int NOT NULL DEFAULT 0,
	`stripe_product_id` varchar(64),
	`stripe_price_id` varchar(64),
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plans_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_artist_cycle` UNIQUE(`artist_id`,`billing_cycle`),
	CONSTRAINT `plans_stripe_price_unique` UNIQUE(`stripe_price_id`)
);
--> statement-breakpoint
CREATE TABLE `playlists` (
	`id` varchar(32) NOT NULL,
	`nom` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`user_id` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `playlists_id` PRIMARY KEY(`id`),
	CONSTRAINT `playlists_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `release` (
	`id` varchar(32) NOT NULL,
	`artist_id` varchar(32) NOT NULL,
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
CREATE TABLE `royalty_payouts` (
	`id` varchar(32) NOT NULL,
	`artist_id` varchar(32) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'EUR',
	`status` varchar(20) NOT NULL DEFAULT 'paid',
	`paid_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `royalty_payouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `single_artists` (
	`id` varchar(32) NOT NULL,
	`artist_id` varchar(32) NOT NULL,
	`single_id` varchar(32) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `single_artists_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_artist_single` UNIQUE(`artist_id`,`single_id`)
);
--> statement-breakpoint
CREATE TABLE `single_tags` (
	`id` varchar(32) NOT NULL,
	`single_id` varchar(32) NOT NULL,
	`tag_id` varchar(32) NOT NULL,
	CONSTRAINT `single_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `single_tag_unique_idx` UNIQUE(`single_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `singles` (
	`id` varchar(32) NOT NULL,
	`title` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`duration` int,
	`cover_url` varchar(256) NOT NULL,
	`audio_url` varchar(256),
	`authors` varchar(512),
	`producers` varchar(512),
	`lyricists` varchar(512),
	`musicians_vocals` varchar(512),
	`musicians_piano_keyboards` varchar(512),
	`musicians_winds` varchar(512),
	`musicians_percussion` varchar(512),
	`musicians_strings` varchar(512),
	`mixing_engineer` varchar(512),
	`mastering_engineer` varchar(512),
	`user_id` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `singles_id` PRIMARY KEY(`id`),
	CONSTRAINT `singles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` varchar(32) NOT NULL,
	`user_id` varchar(32) NOT NULL,
	`artist_id` varchar(32) NOT NULL,
	`plan_id` varchar(32) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'active',
	`start_date` timestamp NOT NULL DEFAULT (now()),
	`end_date` timestamp NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'EUR',
	`auto_renew` boolean NOT NULL DEFAULT true,
	`stripe_customer_id` varchar(64),
	`stripe_subscription_id` varchar(64),
	`stripe_checkout_session_id` varchar(128),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_user_artist` UNIQUE(`user_id`,`artist_id`),
	CONSTRAINT `subscriptions_stripe_sub_unique` UNIQUE(`stripe_subscription_id`),
	CONSTRAINT `subscriptions_stripe_checkout_unique` UNIQUE(`stripe_checkout_session_id`)
);
--> statement-breakpoint
CREATE TABLE `suggestion` (
	`id` varchar(32) NOT NULL,
	`email` varchar(256) NOT NULL,
	`song` varchar(512) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suggestion_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` varchar(32) NOT NULL,
	`name` varchar(256) NOT NULL,
	`slug` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `testers` (
	`id` varchar(32) NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(256) NOT NULL,
	`ageRange` varchar(16) NOT NULL,
	`language` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `track_albums` (
	`id` varchar(32) NOT NULL,
	`album_id` varchar(32) NOT NULL,
	`track_id` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `track_albums_id` PRIMARY KEY(`id`),
	CONSTRAINT `album_track_unique_idx` UNIQUE(`album_id`,`track_id`)
);
--> statement-breakpoint
CREATE TABLE `track_eps` (
	`id` varchar(32) NOT NULL,
	`ep_id` varchar(32) NOT NULL,
	`track_id` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `track_eps_id` PRIMARY KEY(`id`),
	CONSTRAINT `ep_track_unique_idx` UNIQUE(`ep_id`,`track_id`)
);
--> statement-breakpoint
CREATE TABLE `track_playlists` (
	`id` varchar(32) NOT NULL,
	`playlist_id` varchar(32) NOT NULL,
	`track_id` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `track_playlists_id` PRIMARY KEY(`id`),
	CONSTRAINT `playlist_track_unique_idx` UNIQUE(`playlist_id`,`track_id`)
);
--> statement-breakpoint
CREATE TABLE `track_releases` (
	`id` varchar(32) NOT NULL,
	`track_id` varchar(32) NOT NULL,
	`release_id` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `track_releases_id` PRIMARY KEY(`id`),
	CONSTRAINT `track_release_unique` UNIQUE(`track_id`,`release_id`)
);
--> statement-breakpoint
CREATE TABLE `track_singles` (
	`id` varchar(32) NOT NULL,
	`single_id` varchar(32) NOT NULL,
	`track_id` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `track_singles_id` PRIMARY KEY(`id`),
	CONSTRAINT `single_track_unique_idx` UNIQUE(`single_id`,`track_id`)
);
--> statement-breakpoint
CREATE TABLE `track_streams` (
	`id` varchar(32) NOT NULL,
	`track_id` varchar(32) NOT NULL,
	`user_id` varchar(32) NOT NULL,
	`ip_address` varchar(45),
	`country` varchar(2),
	`city` varchar(191),
	`device` varchar(50),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `track_streams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `track_tags` (
	`id` varchar(32) NOT NULL,
	`track_id` varchar(32) NOT NULL,
	`tag_id` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `track_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `track_tag_unique_idx` UNIQUE(`track_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `tracks` (
	`id` varchar(32) NOT NULL,
	`isrc_code` varchar(256) NOT NULL,
	`title` varchar(256),
	`slug` varchar(256) NOT NULL,
	`type` varchar(256) NOT NULL,
	`user_id` varchar(32),
	`duration` double,
	`mood_id` varchar(32) NOT NULL,
	`audio_url` varchar(2048) NOT NULL,
	`lyrics` text,
	`sign_language_video_url` varchar(2048),
	`braille_file_url` varchar(2048),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tracks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` varchar(32) NOT NULL,
	`user_id` varchar(32) NOT NULL,
	`subscription_id` varchar(32),
	`amount` decimal(10,2) NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_tags` (
	`id` varchar(32) NOT NULL,
	`user_id` varchar(32) NOT NULL,
	`tag_id` varchar(32) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_tag_unique_idx` UNIQUE(`user_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(32) NOT NULL,
	`name` varchar(256) NOT NULL,
	`surname` varchar(256) NOT NULL,
	`videoIntroUrl` varchar(512),
	`miniVideoLoopUrl` varchar(512),
	`username` varchar(256),
	`email` varchar(256) NOT NULL,
	`password` varchar(256) NOT NULL,
	`profileImageUrl` varchar(512),
	`type` varchar(256),
	`isSubscribed` boolean NOT NULL DEFAULT false,
	`artistName` varchar(256),
	`genre` varchar(256),
	`bio` varchar(1024),
	`country` varchar(128),
	`twoFactorEnabled` boolean NOT NULL DEFAULT false,
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
ALTER TABLE `albums` ADD CONSTRAINT `albums_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artist_admins` ADD CONSTRAINT `artist_admins_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artist_admins` ADD CONSTRAINT `artist_admins_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artist_payout_settings` ADD CONSTRAINT `artist_payout_settings_artist_id_users_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artist_tags` ADD CONSTRAINT `artist_tags_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artist_tags` ADD CONSTRAINT `artist_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `editor_playlist_tracks` ADD CONSTRAINT `editor_playlist_tracks_editor_playlist_id_editor_playlists_id_fk` FOREIGN KEY (`editor_playlist_id`) REFERENCES `editor_playlists`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `editor_playlist_tracks` ADD CONSTRAINT `editor_playlist_tracks_track_id_tracks_id_fk` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `editor_playlists` ADD CONSTRAINT `editor_playlists_created_by_user_id_users_id_fk` FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ep_artists` ADD CONSTRAINT `ep_artists_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ep_artists` ADD CONSTRAINT `ep_artists_ep_id_eps_id_fk` FOREIGN KEY (`ep_id`) REFERENCES `eps`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ep_tags` ADD CONSTRAINT `ep_tags_ep_id_eps_id_fk` FOREIGN KEY (`ep_id`) REFERENCES `eps`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ep_tags` ADD CONSTRAINT `ep_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `eps` ADD CONSTRAINT `eps_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exclusive_contents` ADD CONSTRAINT `exclusive_contents_artist_id_users_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plans` ADD CONSTRAINT `plans_artist_id_users_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlists` ADD CONSTRAINT `playlists_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `release` ADD CONSTRAINT `release_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `royalty_payouts` ADD CONSTRAINT `royalty_payouts_artist_id_users_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `single_artists` ADD CONSTRAINT `single_artists_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `single_artists` ADD CONSTRAINT `single_artists_single_id_singles_id_fk` FOREIGN KEY (`single_id`) REFERENCES `singles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `single_tags` ADD CONSTRAINT `single_tags_single_id_singles_id_fk` FOREIGN KEY (`single_id`) REFERENCES `singles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `single_tags` ADD CONSTRAINT `single_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `singles` ADD CONSTRAINT `singles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_artist_id_users_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_plan_id_plans_id_fk` FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_albums` ADD CONSTRAINT `track_albums_album_id_albums_id_fk` FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_albums` ADD CONSTRAINT `track_albums_track_id_tracks_id_fk` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_eps` ADD CONSTRAINT `track_eps_ep_id_eps_id_fk` FOREIGN KEY (`ep_id`) REFERENCES `eps`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_eps` ADD CONSTRAINT `track_eps_track_id_tracks_id_fk` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_playlists` ADD CONSTRAINT `track_playlists_playlist_id_playlists_id_fk` FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_playlists` ADD CONSTRAINT `track_playlists_track_id_tracks_id_fk` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_releases` ADD CONSTRAINT `track_releases_track_id_tracks_id_fk` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_releases` ADD CONSTRAINT `track_releases_release_id_release_id_fk` FOREIGN KEY (`release_id`) REFERENCES `release`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_singles` ADD CONSTRAINT `track_singles_single_id_singles_id_fk` FOREIGN KEY (`single_id`) REFERENCES `singles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_singles` ADD CONSTRAINT `track_singles_track_id_tracks_id_fk` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_streams` ADD CONSTRAINT `track_streams_track_id_tracks_id_fk` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_streams` ADD CONSTRAINT `track_streams_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_tags` ADD CONSTRAINT `track_tags_track_id_tracks_id_fk` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `track_tags` ADD CONSTRAINT `track_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tracks` ADD CONSTRAINT `tracks_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tracks` ADD CONSTRAINT `tracks_mood_id_mood_id_fk` FOREIGN KEY (`mood_id`) REFERENCES `mood`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_subscription_id_subscriptions_id_fk` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_tags` ADD CONSTRAINT `user_tags_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_tags` ADD CONSTRAINT `user_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `album_slug_idx` ON `albums` (`slug`);--> statement-breakpoint
CREATE INDEX `artist_payout_settings_artist_idx` ON `artist_payout_settings` (`artist_id`);--> statement-breakpoint
CREATE INDEX `editor_playlist_tracks_playlist_idx` ON `editor_playlist_tracks` (`editor_playlist_id`);--> statement-breakpoint
CREATE INDEX `editor_playlist_tracks_position_idx` ON `editor_playlist_tracks` (`position`);--> statement-breakpoint
CREATE INDEX `editor_playlist_published_idx` ON `editor_playlists` (`is_published`);--> statement-breakpoint
CREATE INDEX `ep_slug_idx` ON `eps` (`slug`);--> statement-breakpoint
CREATE INDEX `exclusive_contents_artist_idx` ON `exclusive_contents` (`artist_id`);--> statement-breakpoint
CREATE INDEX `plans_artist_id_idx` ON `plans` (`artist_id`);--> statement-breakpoint
CREATE INDEX `playlist_slug_idx` ON `playlists` (`slug`);--> statement-breakpoint
CREATE INDEX `royalty_payouts_artist_id_idx` ON `royalty_payouts` (`artist_id`);--> statement-breakpoint
CREATE INDEX `royalty_payouts_status_idx` ON `royalty_payouts` (`status`);--> statement-breakpoint
CREATE INDEX `royalty_payouts_created_at_idx` ON `royalty_payouts` (`created_at`);--> statement-breakpoint
CREATE INDEX `single_slug_idx` ON `singles` (`slug`);--> statement-breakpoint
CREATE INDEX `subscriptions_artist_idx` ON `subscriptions` (`artist_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_user_idx` ON `subscriptions` (`user_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_status_idx` ON `subscriptions` (`status`);--> statement-breakpoint
CREATE INDEX `tag_slug_idx` ON `tags` (`slug`);--> statement-breakpoint
CREATE INDEX `track_streams_track_id_idx` ON `track_streams` (`track_id`);--> statement-breakpoint
CREATE INDEX `track_streams_user_id_idx` ON `track_streams` (`user_id`);--> statement-breakpoint
CREATE INDEX `track_streams_created_at_idx` ON `track_streams` (`created_at`);--> statement-breakpoint
CREATE INDEX `track_slug_idx` ON `tracks` (`slug`);