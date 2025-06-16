CREATE TABLE `partners` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`company_type` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "company_type_check" CHECK("partners"."company_type" IN ('domestic', 'foreign'))
);
--> statement-breakpoint
CREATE TABLE `quotation_companies_items` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`item_id` text NOT NULL,
	`value` real,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `partners`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`item_id`) REFERENCES `quotation_items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quotation_items` (
	`id` text PRIMARY KEY NOT NULL,
	`item_name` text NOT NULL,
	`item_origin` text NOT NULL,
	`item_name_en` text,
	`item_origin_en` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
