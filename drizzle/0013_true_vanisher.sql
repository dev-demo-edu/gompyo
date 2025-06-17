CREATE TABLE `company_years` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`year` integer NOT NULL,
	`lample_opening_balance` real DEFAULT 0,
	`gompyo_opening_balance` real DEFAULT 0,
	`lample_closing_balance` real DEFAULT 0,
	`gompyo_closing_balance` real DEFAULT 0,
	`is_active` integer DEFAULT true,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `partner_companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `financial_data` (
	`id` text PRIMARY KEY NOT NULL,
	`year_id` text NOT NULL,
	`month` text NOT NULL,
	`is_carryover` integer DEFAULT false,
	`lample_purchase` real,
	`lample_payment` real,
	`gompyo_purchase` real,
	`gompyo_payment` real,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`year_id`) REFERENCES `company_years`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `partner_companies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "partner_company_type_check" CHECK("partner_companies"."type" IN ('payment', 'collection'))
);
