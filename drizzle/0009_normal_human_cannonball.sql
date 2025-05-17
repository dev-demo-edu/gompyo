PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`password` text,
	`name` text,
	`plan_column_order` text DEFAULT '[{"field":"contractNumber","width":130},{"field":"progressStatus","width":100},{"field":"contractDate","width":150},{"field":"exporter","width":120},{"field":"importer","width":120},{"field":"estimatedTimeArrival","width":150},{"field":"arrivalPort","width":120},{"field":"itemName","width":120},{"field":"contractTon","width":100},{"field":"unitPrice","width":130},{"field":"totalPrice","width":150},{"field":"paymentMethod","width":100},{"field":"warehouseEntryDate","width":150},{"field":"importCostPerKg","width":130},{"field":"supplyCostPerKg","width":130},{"field":"totalCost","width":150},{"field":"totalCostPerKg","width":130},{"field":"sellingPrice","width":130},{"field":"margin","width":100},{"field":"totalProfit","width":150}]',
	`shipment_column_order` text DEFAULT '[{"field":"contractNumber","width":130},{"field":"progressStatus","width":100},{"field":"contractDate","width":150},{"field":"importer","width":120},{"field":"productName","width":150},{"field":"itemName","width":120},{"field":"weight","width":100},{"field":"containerCount","width":120},{"field":"packingUnit","width":100},{"field":"unitPrice","width":130},{"field":"totalPrice","width":150},{"field":"supplyPrice","width":130},{"field":"sellingPrice","width":130},{"field":"paymentMethod","width":100},{"field":"hsCode","width":120},{"field":"blNumber","width":120},{"field":"departurePort","width":120},{"field":"etd","width":150},{"field":"arrivalPort","width":120},{"field":"eta","width":150},{"field":"exporter","width":120},{"field":"customsDate","width":150}]'
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "password", "name", "plan_column_order", "shipment_column_order") SELECT "id", "email", "password", "name", "plan_column_order", "shipment_column_order" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `cargos` ADD `created_at` text;--> statement-breakpoint
ALTER TABLE `cargos` ADD `updated_at` text;--> statement-breakpoint
ALTER TABLE `contracts` ADD `created_at` text;--> statement-breakpoint
ALTER TABLE `contracts` ADD `updated_at` text;--> statement-breakpoint
ALTER TABLE `shipments` ADD `created_at` text;--> statement-breakpoint
ALTER TABLE `shipments` ADD `updated_at` text;--> statement-breakpoint
ALTER TABLE `cost_details` DROP COLUMN `custom_tax_amount`;
