/**
 * Migration Runner - Applies pending database migrations
 * Run: node scripts/runMigrations.js
 */

require("dotenv").config();
const db = require("../config/db");
const fs = require("fs");
const path = require("path");

const migrationsDir = path.join(__dirname, "../migrations");

// Helper to run a query (with error handling for existing columns)
const runQuery = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      // Ignore "Duplicate column name" errors
      if (err && err.code === 'ER_DUP_FIELDNAME') {
        console.log(`  ⚠️  Column already exists (skipping)`);
        resolve(results);
      } else if (err && err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
        console.log(`  ⚠️  Column/Index already exists (skipping)`);
        resolve(results);
      } else if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Helper to clean SQL comments
function cleanSQL(sql) {
  return sql
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim();
}

// Main migration runner
async function runMigrations() {
  try {
    console.log("🔄 Starting migrations...");

    // Read migration files
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      if (file.endsWith(".sql")) {
        const filePath = path.join(migrationsDir, file);
        let sql = fs.readFileSync(filePath, "utf8");

        console.log(`\n📋 Running migration: ${file}`);

        // Clean comments
        sql = cleanSQL(sql);

        // Split by semicolon and execute each statement
        const statements = sql
          .split(";")
          .map((stmt) => stmt.trim())
          .filter((stmt) => stmt.length > 0);

        for (const statement of statements) {
          console.log(`  ➜ Executing: ${statement.substring(0, 60)}...`);
          await runQuery(statement);
        }

        console.log(`✅ Migration ${file} completed successfully`);
      }
    }

    console.log("\n✨ All migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

runMigrations();
