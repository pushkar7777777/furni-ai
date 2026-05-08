const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root123",
  database: process.env.DB_NAME || "furni",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : false
});

const runQuery = (sql, label) => {
  db.query(sql, (err) => {
    if (err) console.error(`Error creating ${label}:`, err.message);
    else console.log(`✓ ${label} ready`);
  });
};

const ensureColumn = (tableName, columnName, columnSql) => {
  db.query(
    `SELECT 1
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?
     LIMIT 1`,
    [tableName, columnName],
    (err, rows) => {
      if (err) {
        console.error(`Error checking ${tableName}.${columnName}:`, err.message);
        return;
      }

      if (!rows.length) {
        runQuery(
          `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnSql}`,
          `${tableName}.${columnName}`
        );
      }
    }
  );
};

db.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL connection error:", err);
    return;
  }

  console.log("MySQL Connected");
  connection.release();

  runQuery(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer', 'staff', 'inventory_manager') DEFAULT 'customer',
    name VARCHAR(255) NULL,
    phone VARCHAR(30) NULL,
    address_line1 VARCHAR(255) NULL,
    address_line2 VARCHAR(255) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    postal_code VARCHAR(30) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "users");

  runQuery(`CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    material VARCHAR(100),
    color VARCHAR(50),
    category_id INT NULL,
    stock INT DEFAULT 0,
    image_url VARCHAR(500),
    description TEXT,
    furniture_category ENUM('sofa', 'bed', 'chair', 'table', 'wardrobe', 'desk', 'lamp', 'rug', 'decoration', 'other') DEFAULT 'other',
    design_style ENUM('modern', 'classic', 'minimal', 'luxury', 'industrial', 'rustic', 'contemporary') DEFAULT 'modern',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "products");
  ensureColumn("products", "category_id", "INT NULL");
  ensureColumn("products", "image_url", "VARCHAR(500)");
  ensureColumn("products", "description", "TEXT");
  ensureColumn("products", "furniture_category", "ENUM('sofa', 'bed', 'chair', 'table', 'wardrobe', 'desk', 'lamp', 'rug', 'decoration', 'other') DEFAULT 'other'");
  ensureColumn("products", "design_style", "ENUM('modern', 'classic', 'minimal', 'luxury', 'industrial', 'rustic', 'contemporary') DEFAULT 'modern'");
  ensureColumn("users", "name", "VARCHAR(255) NULL");
  ensureColumn("users", "phone", "VARCHAR(30) NULL");
  ensureColumn("users", "address_line1", "VARCHAR(255) NULL");
  ensureColumn("users", "address_line2", "VARCHAR(255) NULL");
  ensureColumn("users", "city", "VARCHAR(100) NULL");
  ensureColumn("users", "state", "VARCHAR(100) NULL");
  ensureColumn("users", "postal_code", "VARCHAR(30) NULL");
  ensureColumn("users", "email_verified", "BOOLEAN NOT NULL DEFAULT FALSE");
  ensureColumn("users", "password_reset_token", "VARCHAR(255) NULL");
  ensureColumn("users", "password_reset_expires", "DATETIME NULL");
  ensureColumn("users", "last_login", "DATETIME NULL");
  ensureColumn("cart", "user_id", "INT NULL");
  ensureColumn("wishlist", "user_id", "INT NULL");
  ensureColumn("orders", "user_id", "INT NULL");
  ensureColumn("orders", "customer_name", "VARCHAR(255) NULL");
  ensureColumn("orders", "customer_email", "VARCHAR(255) NULL");
  ensureColumn("orders", "shipping_address", "VARCHAR(255) NULL");
  ensureColumn("orders", "shipping_city", "VARCHAR(100) NULL");
  ensureColumn("orders", "shipping_state", "VARCHAR(100) NULL");
  ensureColumn("orders", "shipping_postal_code", "VARCHAR(30) NULL");
  ensureColumn("orders", "payment_method", "VARCHAR(50) NULL");
  ensureColumn("orders", "coupon_code", "VARCHAR(50) NULL");
  ensureColumn("orders", "discount_amount", "DECIMAL(10,2) NOT NULL DEFAULT 0");
  ensureColumn("orders", "shipping_charge", "DECIMAL(10,2) NOT NULL DEFAULT 0");
  ensureColumn("orders", "subtotal", "DECIMAL(10,2) NOT NULL DEFAULT 0");
  ensureColumn("orders", "delivery_distance_km", "DECIMAL(10,2) NOT NULL DEFAULT 0");
  ensureColumn("orders", "delivery_zone", "VARCHAR(50) NULL");
  ensureColumn("orders", "delivery_eta", "VARCHAR(50) NULL");
  ensureColumn("orders", "payment_status", "VARCHAR(50) NULL");
  ensureColumn("order_items", "unit_price", "DECIMAL(10,2) NOT NULL DEFAULT 0");
  ensureColumn("reviews", "user_id", "INT NULL");
  ensureColumn("reviews", "reviewer_name", "VARCHAR(255) NULL");

  runQuery(`CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "categories");

  runQuery(`CREATE TABLE IF NOT EXISTS vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    contact VARCHAR(20),
    email VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "vendors");

  runQuery(`CREATE TABLE IF NOT EXISTS quotations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    items TEXT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "quotations");

  runQuery(`CREATE TABLE IF NOT EXISTS inventory_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    type ENUM('IN', 'OUT') NOT NULL,
    quantity INT NOT NULL,
    reference VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )`, "inventory_logs");

  runQuery(`CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    status ENUM('Active', 'On Leave', 'Terminated') DEFAULT 'Active',
    join_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "employees");

  runQuery(`CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late', 'Leave') DEFAULT 'Present',
    check_in TIME,
    check_out TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
  )`, "attendance");

  runQuery(`CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "expenses");

  runQuery(`CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )`, "cart");

  runQuery(`CREATE TABLE IF NOT EXISTS wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )`, "wishlist");

  runQuery(`CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "orders");

  runQuery(`CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )`, "order_items");

  runQuery(`CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )`, "reviews");

  runQuery(`CREATE TABLE IF NOT EXISTS alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    type ENUM('stock', 'price') NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )`, "alerts");

  runQuery(`CREATE TABLE IF NOT EXISTS emi_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    product_id INT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    down_payment DECIMAL(12,2) NOT NULL,
    monthly_emi DECIMAL(12,2) NOT NULL,
    tenure INT NOT NULL,
    remaining_amount DECIMAL(12,2) NOT NULL,
    status ENUM('active', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "emi_plans");

  runQuery(`CREATE TABLE IF NOT EXISTS service_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    product_id INT NOT NULL,
    issue TEXT NOT NULL,
    status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "service_requests");

  runQuery(`CREATE TABLE IF NOT EXISTS exchange_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    old_product_desc TEXT NOT NULL,
    estimated_value DECIMAL(12,2) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "exchange_requests");

  runQuery(`CREATE TABLE IF NOT EXISTS deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status ENUM('processing', 'shipped', 'delivered') DEFAULT 'processing',
    installation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "deliveries");

  runQuery(`CREATE TABLE IF NOT EXISTS offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    discount_percent DECIMAL(5,2) NOT NULL,
    expiry_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "offers");

  runQuery(`CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(100) NOT NULL,
    material_supplied VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "suppliers");

  runQuery(`CREATE TABLE IF NOT EXISTS rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    monthly_rent DECIMAL(12,2) NOT NULL,
    duration INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, "rentals");

  runQuery(`CREATE TABLE IF NOT EXISTS room_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    image_url VARCHAR(500) NOT NULL,
    detected_color VARCHAR(50),
    detected_style ENUM('modern', 'classic', 'minimal', 'luxury', 'industrial', 'rustic', 'contemporary'),
    detected_room_type ENUM('bedroom', 'living_room', 'office', 'kitchen', 'bathroom', 'dining_room'),
    harmony_score INT DEFAULT 0,
    analysis_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, created_at)
  )`, "room_analysis");
});

module.exports = db;
