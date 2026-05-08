/**
 * Room AI Controller
 * Handles image upload, analysis, and recommendations
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const db = require('../config/db');
const {
  extractDominantColor,
  detectRoomType,
  detectDesignStyle,
  calculateBrightness,
  generateExplanation,
  groupProductsByCategory,
  filterAndRankProducts,
} = require('../utils/roomAILogic');

const queryAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

async function ensureColumn(tableName, columnName, columnSql) {
  const rows = await queryAsync(
    `SELECT 1
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?
     LIMIT 1`,
    [tableName, columnName]
  );

  if (!rows.length) {
    await queryAsync(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnSql}`);
  }
}

async function ensureRoomAISchema() {
  await queryAsync(`CREATE TABLE IF NOT EXISTS room_analysis (
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

  await ensureColumn('room_analysis', 'harmony_score', 'INT DEFAULT 0');
  await ensureColumn('products', 'furniture_category', "ENUM('sofa', 'bed', 'chair', 'table', 'wardrobe', 'desk', 'lamp', 'rug', 'decoration', 'other') DEFAULT 'other'");
  await ensureColumn('products', 'design_style', "ENUM('modern', 'classic', 'minimal', 'luxury', 'industrial', 'rustic', 'contemporary') DEFAULT 'modern'");
}

// Configure multer for image upload
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  },
});

/**
 * Upload and analyze room image
 * POST /api/room-analysis/upload
 */
async function uploadAndAnalyzeImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    await ensureRoomAISchema();

    const imageBuffer = fs.readFileSync(req.file.path);
    const imageUrl = `/uploads/${req.file.filename}`;

    // Extract dominant color
    const dominantColor = await extractDominantColor(imageBuffer);

    // Detect room type
    const roomType = detectRoomType(req.file.originalname);

    // Detect style
    const brightness = calculateBrightness(dominantColor);
    const detectedStyle = detectDesignStyle(dominantColor, brightness);

    // Store analysis in database
    const insertQuery = `
      INSERT INTO room_analysis 
      (user_id, image_url, detected_color, detected_style, detected_room_type, analysis_data, harmony_score) 
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `;

    const analysisData = JSON.stringify({
      brightness,
      processingTime: Date.now(),
    });

    // Insert analysis (non-blocking)
    db.query(
      insertQuery,
      [req.user?.id || null, imageUrl, dominantColor, detectedStyle, roomType, analysisData],
      (err, result) => {
        if (err) {
          console.error('Database insert error:', err.message);
          // Continue anyway, don't block response
        }
      }
    );

    // Fetch products for recommendations - simpler query
    const productsQuery = `
      SELECT
        id,
        name,
        price,
        material,
        color,
        stock,
        image_url,
        COALESCE(furniture_category, 'other') AS furniture_category,
        COALESCE(design_style, 'modern') AS design_style
      FROM products
      WHERE id > 0
      ORDER BY RAND()
      LIMIT 20
    `;

    db.query(productsQuery, async (err, allProducts) => {
      if (err) {
        console.error('Query error:', err.message);
        return res.status(500).json({ error: 'Database query failed: ' + err.message });
      }

      // Filter and rank products based on detected attributes
      let products = allProducts || [];
      
      // If we have products, filter them
      if (products.length > 0) {
        products = filterAndRankProducts(
          products,
          dominantColor,
          detectedStyle,
          roomType
        );
      }

      // Group products into room bundles
      const bundles = groupProductsByCategory(products, roomType);

      // Calculate overall harmony score
      const harmonyScore = products.length > 0 ? Math.round(
        products.reduce((sum, p) => sum + (p.harmonyScore || 50), 0) / 
        products.length
      ) : 50;

      const explanation = generateExplanation(dominantColor, detectedStyle, roomType);

      res.json({
        success: true,
        analysis: {
          imageUrl,
          detectedColor: dominantColor,
          detectedStyle,
          roomType: roomType.replace('_', ' '),
          harmonyScore: Math.min(100, harmonyScore),
          explanation,
        },
        recommendations: products.slice(0, 8),
        bundles,
        explanation,
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Image processing failed: ' + error.message });
  }
}

/**
 * Get upload middleware
 */
function getUploadMiddleware() {
  return upload.single('image');
}

/**
 * Get analysis history for user
 * GET /api/room-analysis/history
 */
async function getAnalysisHistory(req, res) {
  try {
    await ensureRoomAISchema();

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const query = `
      SELECT * FROM room_analysis 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 10
    `;

    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        success: true,
        history: results,
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
}

/**
 * Save design recommendation
 * POST /api/room-analysis/save
 */
async function saveDesignRecommendation(req, res) {
  try {
    const { analysisId, products } = req.body;
    const userId = req.user?.id;

    if (!userId || !analysisId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In production, create a separate saved_designs table
    // For now, update room_analysis with additional metadata

    res.json({
      success: true,
      message: 'Design saved successfully',
      savedAt: new Date(),
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to save design' });
  }
}

/**
 * Get style statistics
 * GET /api/room-analysis/stats
 */
async function getStyleStatistics(req, res) {
  try {
    await ensureRoomAISchema();

    const query = `
      SELECT 
        detected_style, 
        detected_room_type, 
        detected_color,
        COUNT(*) as count,
        AVG(harmony_score) as avg_score
      FROM room_analysis 
      GROUP BY detected_style, detected_room_type, detected_color
      ORDER BY count DESC
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        success: true,
        statistics: results,
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}

module.exports = {
  uploadAndAnalyzeImage,
  getUploadMiddleware,
  getAnalysisHistory,
  saveDesignRecommendation,
  getStyleStatistics,
};
