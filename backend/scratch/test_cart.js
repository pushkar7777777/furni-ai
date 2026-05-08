const pool = require("../models/db");
const CartModel = require("../models/cartModel");

async function testAdd() {
  try {
    // Assuming user 1 and product 19 exist
    const result = await CartModel.add(1, 19, 1);
    console.log("Add result:", result);
    
    const items = await CartModel.getAll(1);
    console.log("Cart items for user 1:", items);
    
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}

testAdd();
