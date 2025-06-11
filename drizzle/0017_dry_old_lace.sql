PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_cargos` (
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
	`selling_price_wholesale` real,
	`selling_price_retail` real,
	`margin` real,
	`total_profit` real,
	`purchase_fee_rate` real,
	`remark` text,
	`created_at` text,
	`updated_at` text,
	CONSTRAINT "progress_status_check" CHECK("__new_cargos"."progress_status" IN ('REVIEW', 'CONTRACTING', 'BEFORE_LC', 'BEFORE_ARRIVAL', 'WAREHOUSE_MOVING', 'BEFORE_QUARANTINE', 'QUARANTINING', 'CUSTOMS_DECLARING', 'DONE_ARRIVAL', 'AFTER_CUSTOMS', 'SELLING', 'SOLD_DONE'))
);
--> statement-breakpoint
INSERT INTO `__new_cargos`("id", "items_id", "shipment_id", "container_count", "contract_ton", "customs_clearance_date", "quarantine_date", "warehouse_entry_date", "progress_status", "selling_price", "selling_price_wholesale", "selling_price_retail", "margin", "total_profit", "purchase_fee_rate", "remark", "created_at", "updated_at") SELECT "id", "items_id", "shipment_id", "container_count", "contract_ton", "customs_clearance_date", "quarantine_date", "warehouse_entry_date", "progress_status", "selling_price", "selling_price_wholesale", "selling_price_retail", "margin", "total_profit", "purchase_fee_rate", "remark", "created_at", "updated_at" FROM `cargos`;--> statement-breakpoint
DROP TABLE `cargos`;--> statement-breakpoint
ALTER TABLE `__new_cargos` RENAME TO `cargos`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
