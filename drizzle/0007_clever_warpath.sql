CREATE TABLE `cashflows` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`company_id` text NOT NULL,
	`counterparty` text NOT NULL,
	`amount` integer NOT NULL,
	`type` text NOT NULL,
	`priority` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT "cashflow_type_check" CHECK("cashflows"."type" IN ('income', 'expense'))
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`company_balance` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
