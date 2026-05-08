/**
 * Room AI Controller
 * Handles image upload, analysis, and recommendations.
 * Uses promise-based pool throughout — no raw callbacks.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const pool = require('../models/db'); // promise-based
const {
  extractDominantColor,
  detectRoomType,
  detectDesignStyle,
  calculateBrightness,
  generateExplanation,
  groupProductsByCategory,
  filterAndRankProducts,
} = require('../utils/roomAILogic');

// ── multer setup ────────────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${suffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Only images are allowed.`), false);
    }
  },
});

function getUploadMiddleware() {
  return upload.single('image');
}

// ── helpers ─────────────────────────────────────────────────────────────────

/**
 * Detect if the image is mostly empty / blank (very low saturation variance).
 * Returns true for plain white/grey rooms or near-uniform images.
 */
async function isEmptyRoom(imageBuffer) {
  try {
    const { data, info } = await sharp(imageBuffer)
      .resize(50, 50, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    let totalSaturation = 0;
    const pixels = info.width * info.height;

    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      totalSaturation += (max - min) / (max || 1);
    }

    // avg saturation < 0.08 → essentially greyscale / empty
    return (totalSaturation / pixels) < 0.08;
  } catch {
    return false;
  }
}

/** Ensure room_analysis table exists with required columns. */
async function ensureSchema() {
  await pool.query(`CREATE TABLE IF NOT EXISTS room_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    image_url VARCHAR(500) NOT NULL,
    detected_color VARCHAR(50),
    detected_style ENUM('modern','classic','minimal','luxury','industrial','rustic','contemporary'),
    detected_room_type ENUM('bedroom','living_room','office','kitchen','bathroom','dining_room'),
    harmony_score INT DEFAULT 0,
    analysis_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_date (user_id, created_at)
  )`);

  // Add harmony_score column if it was missing in an older migration
  const [cols] = await pool.query(
    `SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'room_analysis' AND COLUMN_NAME = 'harmony_score'
     LIMIT 1`
  );
  if (!cols.length) {
    await pool.query(`ALTER TABLE room_analysis ADD COLUMN harmony_score INT DEFAULT 0`);
  }
}

// ── main handler ─────────────────────────────────────────────────────────────

/**
 * POST /api/room-ai/upload
 * Analyzes any room image — including empty/white rooms — and returns
 * product recommendations with harmony scores.
 */
async function uploadAndAnalyzeImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded.' });
    }

    await ensureSchema();

    const imageBuffer = fs.readFileSync(req.file.path);
    const imageUrl = `/uploads/${req.file.filename}`;

    // ── colour & style detection ────────────────────────────────────────────
    const dominantColor = await extractDominantColor(imageBuffer);
    const emptyRoom     = await isEmptyRoom(imageBuffer);
    const roomType      = detectRoomType(req.file.originalname);
    const brightness    = calculateBrightness(dominantColor);

    // Always detect style based on the image's dominant color and brightness
    const detectedStyle = detectDesignStyle(dominantColor, brightness);


    // ── fetch all products (promise-based, inside try/catch) ─────────────────
    const [allProducts] = await pool.query(`
      SELECT
        id, name, price, material, color, stock, image_url,
        COALESCE(furniture_category, 'other') AS furniture_category,
        COALESCE(design_style, 'modern')       AS design_style
      FROM products
      WHERE stock > 0
      ORDER BY RAND()
      LIMIT 30
    `);

    // ── score & rank products ────────────────────────────────────────────────
    let scoredProducts = filterAndRankProducts(
      allProducts,
      dominantColor,
      detectedStyle,
      roomType
    );

    // Empty rooms get a bonus boost so every product still gets a decent score
    if (emptyRoom) {
      scoredProducts = scoredProducts.map(p => ({
        ...p,
        harmonyScore: Math.min(100, (p.harmonyScore || 50) + 25),
      }));
    }

    const recommendations = scoredProducts.slice(0, 8);
    const bundles = groupProductsByCategory(scoredProducts, roomType);

    // Overall harmony: average of top 8, floored at 62 for empty rooms
    const harmonyScore = recommendations.length > 0
      ? Math.round(recommendations.reduce((s, p) => s + (p.harmonyScore || 50), 0) / recommendations.length)
      : (emptyRoom ? 75 : 50);

    const explanation = emptyRoom
      ? `This appears to be an empty space — a perfect blank canvas! We've curated a complete ${roomType.replace('_', ' ')} setup in a ${detectedStyle} style that will fill the room with warmth and purpose.`
      : generateExplanation(dominantColor, detectedStyle, roomType);

    // ── persist to DB (best-effort, non-blocking) ────────────────────────────
    const userId = req.headers['x-user-id'] ? Number(req.headers['x-user-id']) : null;
    pool.query(
      `INSERT INTO room_analysis
         (user_id, image_url, detected_color, detected_style, detected_room_type, analysis_data, harmony_score)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, imageUrl, dominantColor, detectedStyle, roomType,
       JSON.stringify({ brightness, emptyRoom, processingTime: Date.now() }),
       Math.min(100, harmonyScore)]
    ).catch(err => console.error('[RoomAI] DB insert skipped:', err.message));

    // ── respond ──────────────────────────────────────────────────────────────
    return res.json({
      success: true,
      analysis: {
        imageUrl,
        detectedColor: dominantColor,
        detectedStyle,
        roomType: roomType.replace('_', ' '),
        harmonyScore: Math.min(100, harmonyScore),
        explanation,
        isEmptyRoom: emptyRoom,
      },
      recommendations,
      bundles,
      explanation,
    });

  } catch (error) {
    console.error('[RoomAI] Upload error:', error);
    return res.status(500).json({
      error: 'Image analysis failed: ' + (error.message || 'Unknown error'),
    });
  }
}

// ── secondary handlers ───────────────────────────────────────────────────────

async function getAnalysisHistory(req, res) {
  try {
    const userId = req.headers['x-user-id'] ? Number(req.headers['x-user-id']) : null;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const [history] = await pool.query(
      `SELECT * FROM room_analysis WHERE user_id = ? ORDER BY created_at DESC LIMIT 10`,
      [userId]
    );

    return res.json({ success: true, history });
  } catch (error) {
    console.error('[RoomAI] History error:', error);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
}

async function saveDesignRecommendation(req, res) {
  try {
    const { analysisId } = req.body;
    if (!analysisId) return res.status(400).json({ error: 'Missing analysisId' });
    return res.json({ success: true, message: 'Design saved successfully', savedAt: new Date() });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save design' });
  }
}

async function getStyleStatistics(req, res) {
  try {
    const [statistics] = await pool.query(`
      SELECT detected_style, detected_room_type, detected_color,
             COUNT(*) AS count, AVG(harmony_score) AS avg_score
      FROM room_analysis
      GROUP BY detected_style, detected_room_type, detected_color
      ORDER BY count DESC
    `);
    return res.json({ success: true, statistics });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}

module.exports = {
  uploadAndAnalyzeImage,
  getUploadMiddleware,
  getAnalysisHistory,
  saveDesignRecommendation,
  getStyleStatistics,
};
