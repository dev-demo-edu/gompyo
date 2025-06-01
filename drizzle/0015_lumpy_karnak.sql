PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_quotation_companies_items` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`item_id` text NOT NULL,
	`value` real,
	`price_type` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `quotation_companies`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`item_id`) REFERENCES `quotation_items`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "price_type_check" CHECK("__new_quotation_companies_items"."price_type" IN ('arrival', 'loading'))
);
--> statement-breakpoint
INSERT INTO `__new_quotation_companies_items`("id", "company_id", "item_id", "value", "price_type", "created_at", "updated_at") SELECT "id", "company_id", "item_id", "value", 'arrival', "created_at", "updated_at" FROM `quotation_companies_items`;--> statement-breakpoint
DROP TABLE `quotation_companies_items`;--> statement-breakpoint
ALTER TABLE `__new_quotation_companies_items` RENAME TO `quotation_companies_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
