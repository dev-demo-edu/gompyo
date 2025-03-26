CREATE TABLE `cargos` (
	`id` text PRIMARY KEY NOT NULL,
	`items_id` text NOT NULL,
	`shipment_id` text NOT NULL,
	`container_count` integer,
	`contract_ton` integer,
	`customs_clearance_date` text,
	`quarantine_date` text,
	`warehouse_entry_date` text,
	`progress_status` text,
	`selling_price` real,
	`margin` real,
	`total_profit` real,
	CONSTRAINT "progress_status_check" CHECK("cargos"."progress_status" IN ('예정', '입고', '출고', '판매'))
);
--> statement-breakpoint
CREATE TABLE `contracts` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_number` text,
	`contract_date` text,
	`contract_party` text,
	`importer` text,
	`incoterms` text
);
--> statement-breakpoint
CREATE TABLE `cost_details` (
	`id` text PRIMARY KEY NOT NULL,
	`unit_price` real,
	`exchange_rate` real,
	`customs_tax_rate` real,
	`custom_tax_amount` real,
	`customs_fee` real,
	`inspection_fee` real,
	`do_charge` real,
	`other_costs` real,
	`cost_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `costs` (
	`id` text PRIMARY KEY NOT NULL,
	`supply_price` real,
	`shipping_cost` real,
	`labor_cost` real,
	`transport_storage_fee` real,
	`loading_unloading_fee` real,
	`cargo_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`document_name` text NOT NULL,
	`document_type` text NOT NULL,
	`s3_url` text NOT NULL,
	`upload_date` text NOT NULL,
	`related_id` text NOT NULL,
	`document_category` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`item_name` text,
	`item_variety` text,
	`origin_country` text,
	`hs_code` text,
	`packing_unit` text
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`payment_due_date` text,
	`payment_method` text NOT NULL,
	`contract_id` integer NOT NULL,
	CONSTRAINT "payment_type_check" CHECK("payments"."payment_method" IN ('T/T', 'CAD', 'L/C', 'Usance'))
);
--> statement-breakpoint
CREATE TABLE `payments_tt` (
	`payment_id` text PRIMARY KEY NOT NULL,
	`advance_payment_date` text,
	`advance_payment_ratio` real,
	`advance_payment_amount` real,
	`remaining_payment_date` text,
	`remaining_payment_ratio` real,
	`remaining_payment_amount` real,
	`counterpart_bank` text,
	FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `payments_usance` (
	`payment_id` text PRIMARY KEY NOT NULL,
	`payment_term` text,
	`contact_exchange_rate` text,
	FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `shipments` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_id` text NOT NULL,
	`estimated_time_arrival` text,
	`estimated_time_departure` text,
	`arrival_port` text,
	`shipping_company` text,
	`departure_port` text,
	`bl_number` text,
	`pallet_order_date` text,
	`pallet_type` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`password` text
);
