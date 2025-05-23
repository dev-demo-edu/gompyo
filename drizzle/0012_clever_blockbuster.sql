CREATE TABLE `stocks` (
	`id` text PRIMARY KEY NOT NULL,
	`cargo_id` text NOT NULL,
	`dnb_cleared` integer DEFAULT 0 NOT NULL,
	`namhae_cleared` integer DEFAULT 0 NOT NULL,
	`interliving_cleared` integer DEFAULT 0 NOT NULL,
	`gompyo_cleared` integer DEFAULT 0 NOT NULL,
	`ramplus_cleared` integer DEFAULT 0 NOT NULL,
	`dnb_uncleared` integer DEFAULT 0 NOT NULL,
	`namhae_uncleared` integer DEFAULT 0 NOT NULL,
	`interliving_uncleared` integer DEFAULT 0 NOT NULL,
	`gompyo_uncleared` integer DEFAULT 0 NOT NULL,
	`ramplus_uncleared` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`cargo_id`) REFERENCES `cargos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `importers` ADD `importer_code` text;
