-- Delivery Zones Table
CREATE TABLE IF NOT EXISTS `delivery_zones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `pincodes` TEXT NOT NULL COMMENT 'Comma-separated pincodes or range (e.g., 110001-110100)',
  `delivery_time` VARCHAR(50) NOT NULL COMMENT 'e.g., 2-3 days',
  `charges` DECIMAL(10, 2) NOT NULL DEFAULT 0,
  `base_charge` DECIMAL(10, 2) NOT NULL DEFAULT 100,
  `per_km_charge` DECIMAL(10, 3) NOT NULL DEFAULT 0.5,
  `handling_charge` DECIMAL(10, 2) NOT NULL DEFAULT 35 COMMENT 'Per item',
  `heavy_item_charge` DECIMAL(10, 2) NOT NULL DEFAULT 220 COMMENT 'For sofas, beds, etc',
  `cod_surcharge` DECIMAL(10, 2) NOT NULL DEFAULT 49,
  `enabled` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_enabled` (`enabled`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default delivery zones
INSERT INTO `delivery_zones` (name, pincodes, delivery_time, charges, base_charge, per_km_charge, handling_charge, heavy_item_charge, cod_surcharge, enabled)
VALUES 
('Delhi NCR', '110001-110100', '2-3 days', 149, 100, 0.5, 35, 220, 49, 1),
('Mumbai Metropolitan', '400001-400700', '2-4 days', 199, 120, 0.75, 35, 220, 49, 1),
('Bangalore', '560001-560100', '3-4 days', 149, 100, 0.6, 35, 220, 49, 1),
('Hyderabad', '500001-500100', '3-5 days', 199, 110, 0.65, 35, 220, 49, 1),
('Pune', '411001-411100', '1-2 days', 99, 80, 0.4, 35, 220, 49, 1),
('Chennai', '600001-600100', '4-5 days', 249, 130, 0.85, 35, 220, 49, 1),
('Kolkata', '700001-700100', '4-6 days', 249, 130, 0.85, 35, 220, 49, 1),
('Jaipur', '302001-302100', '4-5 days', 199, 110, 0.7, 35, 220, 49, 1),
('Remote Areas', 'REMOTE', '7-10 days', 399, 200, 1.5, 50, 300, 99, 1);

-- Index for faster queries
CREATE INDEX idx_pincodes ON delivery_zones(pincodes(20));
