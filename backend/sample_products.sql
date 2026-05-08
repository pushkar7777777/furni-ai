/**
 * Sample Products for RoomAI Testing
 * Insert these products to test the RoomAI feature
 * 
 * Run: mysql -u root -p furni_ai_hub < sample_products.sql
 */

-- Sample Test Products with Furniture Categories and Styles
INSERT INTO products (
  name, price, material, color, category_id, 
  stock, image_url, description, 
  furniture_category, design_style
) VALUES

-- Modern Sofas
('Modern Gray Sectional Sofa', 45999, 'Fabric', 'gray', 1, 15,
 '/products/sofa-modern-gray.jpg', 
 'Sleek modern sectional with chrome legs',
 'sofa', 'modern'),

('Luxury Black Leather Sofa', 89999, 'Leather', 'black', 1, 8,
 '/products/sofa-luxury-black.jpg',
 'Premium leather sofa with gold accents',
 'sofa', 'luxury'),

('Classic Brown Couch', 55999, 'Fabric', 'brown', 1, 12,
 '/products/sofa-classic-brown.jpg',
 'Traditional style brown sofa with wooden frame',
 'sofa', 'classic'),

('Minimal White Settee', 32999, 'Linen', 'white', 1, 20,
 '/products/sofa-minimal-white.jpg',
 'Clean minimal white sofa for modern spaces',
 'sofa', 'minimal'),

-- Modern Beds
('Platform Bed - Modern Gray', 34999, 'Metal', 'gray', 2, 10,
 '/products/bed-platform-gray.jpg',
 'Contemporary platform bed with storage',
 'bed', 'modern'),

('Luxury Gold Bed Frame', 78999, 'Wrought Iron', 'gold', 2, 6,
 '/products/bed-luxury-gold.jpg',
 'Ornate gold-finished luxury bed frame',
 'bed', 'luxury'),

('Classic Wooden Bed', 42999, 'Wood', 'brown', 2, 14,
 '/products/bed-classic-wood.jpg',
 'Traditional solid wood bed frame',
 'bed', 'classic'),

('Minimal Platform White', 28999, 'Metal', 'white', 2, 18,
 '/products/bed-minimal-white.jpg',
 'Simple minimalist white platform bed',
 'bed', 'minimal'),

-- Modern Chairs
('Accent Chair - Modern Black', 18999, 'Fabric', 'black', 3, 25,
 '/products/chair-modern-black.jpg',
 'Contemporary accent chair with geometric design',
 'chair', 'modern'),

('Luxury Velvet Chair', 45999, 'Velvet', 'purple', 3, 8,
 '/products/chair-luxury-velvet.jpg',
 'Premium velvet chair with chrome legs',
 'chair', 'luxury'),

('Classic Wooden Chair', 12999, 'Wood', 'brown', 3, 30,
 '/products/chair-classic-wood.jpg',
 'Traditional dining chair with carved details',
 'chair', 'classic'),

('Minimal Eames Chair', 28999, 'Plastic', 'white', 3, 22,
 '/products/chair-minimal-eames.jpg',
 'Iconic minimal design chair',
 'chair', 'minimal'),

-- Modern Tables
('Glass Coffee Table - Modern', 15999, 'Glass', 'black', 4, 20,
 '/products/table-coffee-glass.jpg',
 'Modern glass top coffee table with metal base',
 'table', 'modern'),

('Luxury Marble Dining Table', 125999, 'Marble', 'gold', 4, 5,
 '/products/table-marble-luxury.jpg',
 'Premium marble dining table with gold frame',
 'table', 'luxury'),

('Classic Wood Dining Table', 38999, 'Wood', 'brown', 4, 12,
 '/products/table-dining-wood.jpg',
 'Traditional rectangular dining table',
 'table', 'classic'),

('Minimal Side Table', 9999, 'Wood', 'white', 4, 35,
 '/products/table-side-minimal.jpg',
 'Simple minimal side table in natural wood',
 'table', 'minimal'),

-- Wardrobes
('Modern Wardrobe - Matte Black', 52999, 'MDF', 'black', 5, 8,
 '/products/wardrobe-modern-black.jpg',
 'Sleek modern wardrobe with soft-close doors',
 'wardrobe', 'modern'),

('Luxury Gold Wardrobe', 98999, 'Solid Wood', 'gold', 5, 4,
 '/products/wardrobe-luxury-gold.jpg',
 'Ornate gold-finished wardrobe with mirror',
 'wardrobe', 'luxury'),

('Classic Brown Wardrobe', 58999, 'Solid Wood', 'brown', 5, 10,
 '/products/wardrobe-classic-brown.jpg',
 'Traditional wooden wardrobe with carved handles',
 'wardrobe', 'classic'),

('Minimal White Wardrobe', 35999, 'MDF', 'white', 5, 16,
 '/products/wardrobe-minimal-white.jpg',
 'Minimalist white wardrobe with clean lines',
 'wardrobe', 'minimal'),

-- Desks
('Gaming Desk - Modern', 22999, 'Metal', 'black', 6, 12,
 '/products/desk-gaming-black.jpg',
 'Modern gaming desk with RGB lighting',
 'desk', 'modern'),

('Executive Desk - Luxury', 89999, 'Solid Wood', 'gold', 6, 3,
 '/products/desk-executive-gold.jpg',
 'Luxury executive desk with leather inlay',
 'desk', 'luxury'),

('Study Table - Classic', 18999, 'Wood', 'brown', 6, 18,
 '/products/desk-study-brown.jpg',
 'Classic wooden study desk with drawers',
 'desk', 'classic'),

('Work Desk - Minimal', 14999, 'Metal', 'white', 6, 20,
 '/products/desk-minimal-white.jpg',
 'Minimalist work desk with clean design',
 'desk', 'minimal'),

-- Lamps
('Pendant Lamp - Modern', 8999, 'Metal', 'black', 7, 40,
 '/products/lamp-pendant-black.jpg',
 'Modern geometric pendant lamp',
 'lamp', 'modern'),

('Crystal Chandelier - Luxury', 34999, 'Crystal', 'gold', 7, 6,
 '/products/lamp-chandelier-luxury.jpg',
 'Luxury crystal chandelier with gold finish',
 'lamp', 'luxury'),

('Table Lamp - Classic', 5999, 'Ceramic', 'brown', 7, 50,
 '/products/lamp-table-classic.jpg',
 'Classic ceramic table lamp with fabric shade',
 'lamp', 'classic'),

('Minimalist Floor Lamp', 6999, 'Metal', 'white', 7, 35,
 '/products/lamp-floor-minimal.jpg',
 'Minimal arc floor lamp in matte white',
 'lamp', 'minimal'),

-- Rugs
('Modern Geometric Rug', 12999, 'Wool', 'gray', 8, 14,
 '/products/rug-geometric-modern.jpg',
 'Modern geometric pattern wool rug',
 'rug', 'modern'),

('Luxury Persian Rug', 45999, 'Silk', 'gold', 8, 4,
 '/products/rug-persian-luxury.jpg',
 'Authentic luxury Persian silk rug',
 'rug', 'luxury'),

('Classic Oriental Rug', 22999, 'Wool', 'brown', 8, 8,
 '/products/rug-oriental-classic.jpg',
 'Traditional oriental design wool rug',
 'rug', 'classic'),

('Minimal Plain Rug', 7999, 'Cotton', 'white', 8, 25,
 '/products/rug-plain-minimal.jpg',
 'Simple minimal cotton rug in white',
 'rug', 'minimal'),

-- Decorations
('Modern Wall Art - Abstract', 3999, 'Canvas', 'black', 9, 60,
 '/products/decor-art-abstract.jpg',
 'Contemporary abstract wall art',
 'decoration', 'modern'),

('Luxury Gold Mirror', 8999, 'Metal', 'gold', 9, 12,
 '/products/decor-mirror-gold.jpg',
 'Luxury gold-framed decorative mirror',
 'decoration', 'luxury'),

('Classic Photo Frame Set', 1999, 'Wood', 'brown', 9, 100,
 '/products/decor-frames-classic.jpg',
 'Traditional wooden photo frame set',
 'decoration', 'classic'),

('Minimal Plant Pot', 2999, 'Ceramic', 'white', 9, 80,
 '/products/decor-pot-minimal.jpg',
 'Minimalist white ceramic plant pot',
 'decoration', 'minimal');

-- Update existing products with categories and styles
UPDATE products SET 
  furniture_category = 'sofa',
  design_style = 'modern'
WHERE name LIKE '%sofa%' OR name LIKE '%couch%' OR name LIKE '%sectional%';

UPDATE products SET 
  furniture_category = 'bed',
  design_style = 'modern'
WHERE name LIKE '%bed%';

UPDATE products SET 
  furniture_category = 'table',
  design_style = 'modern'
WHERE name LIKE '%table%' AND name NOT LIKE '%lamp%';

UPDATE products SET 
  furniture_category = 'chair',
  design_style = 'modern'
WHERE name LIKE '%chair%';

UPDATE products SET 
  furniture_category = 'wardrobe',
  design_style = 'modern'
WHERE name LIKE '%wardrobe%';

UPDATE products SET 
  furniture_category = 'desk',
  design_style = 'modern'
WHERE name LIKE '%desk%' OR name LIKE '%table%' AND name LIKE '%office%';

UPDATE products SET 
  furniture_category = 'lamp',
  design_style = 'modern'
WHERE name LIKE '%lamp%' OR name LIKE '%light%' OR name LIKE '%chandelier%';

UPDATE products SET 
  furniture_category = 'rug',
  design_style = 'modern'
WHERE name LIKE '%rug%' OR name LIKE '%carpet%';

UPDATE products SET 
  furniture_category = 'decoration',
  design_style = 'modern'
WHERE name LIKE '%decor%' OR name LIKE '%mirror%' OR name LIKE '%picture%' OR name LIKE '%art%';

-- Verify insertions
SELECT COUNT(*) as total_products, 
       SUM(CASE WHEN furniture_category IS NOT NULL THEN 1 ELSE 0 END) as categorized,
       SUM(CASE WHEN design_style IS NOT NULL THEN 1 ELSE 0 END) as styled
FROM products;

-- View categorized products by category and style
SELECT furniture_category, design_style, COUNT(*) as count, AVG(price) as avg_price
FROM products
WHERE furniture_category IS NOT NULL
GROUP BY furniture_category, design_style
ORDER BY furniture_category, design_style;
