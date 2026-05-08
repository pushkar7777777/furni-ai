/**
 * Fix placeholder product images with real Unsplash URLs
 */
const pool = require('../models/db');

const imageMap = [
  // Sofas
  { keywords: ['sofa', 'couch', 'sectional', 'loveseat', 'reclining'], url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop' },
  // Beds
  { keywords: ['bed', 'mattress', 'bunk'], url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop' },
  // Chairs
  { keywords: ['chair', 'armchair', 'lounge', 'accent', 'bar stool', 'stool', 'dining chair'], url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800&auto=format&fit=crop' },
  // Tables / Desks
  { keywords: ['table', 'desk', 'coffee', 'dining'], url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop' },
  // Wardrobes / Storage
  { keywords: ['wardrobe', 'storage', 'drawer', 'dresser', 'dressing'], url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=800&auto=format&fit=crop' },
  // Shelves / Bookcases
  { keywords: ['shelf', 'bookshelf', 'bookcase', 'rack'], url: 'https://images.unsplash.com/photo-1588323052347-1e63b51ee0a7?q=80&w=800&auto=format&fit=crop' },
  // TV stands
  { keywords: ['tv stand', 'entertainment', 'media'], url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop' },
  // Bedside tables
  { keywords: ['bedside', 'nightstand', 'side table'], url: 'https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=800&auto=format&fit=crop' },
];

function getUnsplashUrl(productName) {
  const nameLower = productName.toLowerCase();
  for (const item of imageMap) {
    if (item.keywords.some(k => nameLower.includes(k))) return item.url;
  }
  // Generic furniture fallback
  return 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=800&auto=format&fit=crop';
}

async function fixImages() {
  try {
    const [products] = await pool.query(
      "SELECT id, name, image_url FROM products WHERE image_url LIKE '%placeholder%' OR image_url IS NULL OR image_url = ''"
    );
    
    console.log(`Found ${products.length} products with broken/placeholder images`);

    for (const product of products) {
      const newUrl = getUnsplashUrl(product.name);
      await pool.query('UPDATE products SET image_url = ? WHERE id = ?', [newUrl, product.id]);
      console.log(`  Updated: [${product.id}] ${product.name} → ${newUrl.slice(0, 60)}...`);
    }

    console.log('\n✅ Done! All product images updated.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixImages();
