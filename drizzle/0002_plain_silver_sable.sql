CREATE TABLE `account_number` (
	`id` text PRIMARY KEY NOT NULL,
	`account_number` text NOT NULL,
	`bank_name` text NOT NULL,
	`owner` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`password` text,
	`name` text,
	`plan_column_order` text DEFAULT '["contractNumber","progressStatus","contractDate","exporter","importer","estimatedTimeArrival","arrivalPort","itemName","contractTon","unitPrice","totalPrice","paymentMethod","warehouseEntryDate","importCostPerKg","supplyCostPerKg","totalCost","totalCostPerKg","sellingPrice","margin","totalProfit"]',
	`shipment_column_order` text DEFAULT '["contractNumber","progressStatus","contractDate","importer","productName","itemName","weight","containerCount","packingUnit","unitPrice","totalPrice","supplyPrice","sellingPrice","paymentMethod","hsCode","blNumber","departurePort","etd","arrivalPort","eta","exporter","customsDate"]'
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "password", "name", "plan_column_order", "shipment_column_order") SELECT "id", "email", "password", "name", "plan_column_order", "shipment_column_order" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
