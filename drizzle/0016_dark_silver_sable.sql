PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_quotation_companies_items` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`item_id` text NOT NULL,
	`value` real,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `quotation_companies`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`item_id`) REFERENCES `quotation_items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_quotation_companies_items`("id", "company_id", "item_id", "value", "created_at", "updated_at") SELECT "id", "company_id", "item_id", "value", "created_at", "updated_at" FROM `quotation_companies_items`;--> statement-breakpoint
DROP TABLE `quotation_companies_items`;--> statement-breakpoint
ALTER TABLE `__new_quotation_companies_items` RENAME TO `quotation_companies_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_quotation_companies` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`company_type` text NOT NULL,
	`price_type` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "company_type_check" CHECK("__new_quotation_companies"."company_type" IN ('domestic', 'foreign')),
	CONSTRAINT "price_type_check" CHECK("__new_quotation_companies"."price_type" IN ('arrival', 'loading'))
);
--> statement-breakpoint
INSERT INTO `__new_quotation_companies`("id", "company_name", "company_type", "price_type", "created_at", "updated_at") SELECT "id", "company_name", "company_type", 'arrival', "created_at", "updated_at" FROM `quotation_companies`;--> statement-breakpoint
DROP TABLE `quotation_companies`;--> statement-breakpoint
ALTER TABLE `__new_quotation_companies` RENAME TO `quotation_companies`;
