PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_cashflows` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`company_id` text NOT NULL,
	`counterparty` text NOT NULL,
	`amount` real NOT NULL,
	`type` text NOT NULL,
	`priority` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "cashflow_type_check" CHECK("__new_cashflows"."type" IN ('income', 'expense'))
);
--> statement-breakpoint
INSERT INTO `__new_cashflows`("id", "date", "company_id", "counterparty", "amount", "type", "priority", "created_at", "updated_at") SELECT "id", "date", "company_id", "counterparty", "amount", "type", "priority", "created_at", "updated_at" FROM `cashflows`;--> statement-breakpoint
DROP TABLE `cashflows`;--> statement-breakpoint
ALTER TABLE `__new_cashflows` RENAME TO `cashflows`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_companies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`company_balance` real NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_companies`("id", "name", "company_balance", "created_at", "updated_at") SELECT "id", "name", "company_balance", "created_at", "updated_at" FROM `companies`;--> statement-breakpoint
DROP TABLE `companies`;--> statement-breakpoint
ALTER TABLE `__new_companies` RENAME TO `companies`;--> statement-breakpoint
ALTER TABLE `account_numbers` ADD `updated_at` text;--> statement-breakpoint
ALTER TABLE `business_numbers` ADD `updated_at` text;
