const pool = require("../models/db");

async function check() {
  try {
    const [cartCols] = await pool.query("SHOW COLUMNS FROM cart");
    console.log("Cart columns:", cartCols.map(c => c.Field));

    const [wishlistCols] = await pool.query("SHOW COLUMNS FROM wishlist");
    console.log("Wishlist columns:", wishlistCols.map(c => c.Field));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
