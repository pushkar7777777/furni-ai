const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root123",
  database: process.env.DB_NAME || "furni",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : false
};

async function ensureColumn(connection, tableName, columnName, columnSql) {
  const [rows] = await connection.execute(
    `SELECT 1
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?
     LIMIT 1`,
    [tableName, columnName]
  );

  if (!rows.length) {
    await connection.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnSql}`);
    console.log(`Added ${tableName}.${columnName}`);
  } else {
    console.log(`${tableName}.${columnName} already exists`);
  }
}

async function main() {
  const connection = await mysql.createConnection(dbConfig);

  await connection.query(`CREATE TABLE IF NOT EXISTS room_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    image_url VARCHAR(500) NOT NULL,
    detected_color VARCHAR(50),
    detected_style ENUM('modern', 'classic', 'minimal', 'luxury', 'industrial', 'rustic', 'contemporary'),
    detected_room_type ENUM('bedroom', 'living_room', 'office', 'kitchen', 'bathroom', 'dining_room'),
    harmony_score INT DEFAULT 0,
    analysis_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_date (user_id, created_at)
  )`);
  console.log("room_analysis ready");

  await ensureColumn(connection, "room_analysis", "harmony_score", "INT DEFAULT 0");
  await ensureColumn(connection, "products", "furniture_category", "ENUM('sofa', 'bed', 'chair', 'table', 'wardrobe', 'desk', 'lamp', 'rug', 'decoration', 'other') DEFAULT 'other'");
  await ensureColumn(connection, "products", "design_style", "ENUM('modern', 'classic', 'minimal', 'luxury', 'industrial', 'rustic', 'contemporary') DEFAULT 'modern'");

  await connection.end();
}

main().catch((error) => {
  console.error("RoomAI schema migration failed:", error.message);
  process.exit(1);
});
