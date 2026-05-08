/**
 * Room AI Routes
 */

const express = require('express');
const router = express.Router();
const {
  uploadAndAnalyzeImage,
  getUploadMiddleware,
  getAnalysisHistory,
  saveDesignRecommendation,
  getStyleStatistics,
} = require('../controllers/roomAIController');

/**
 * Upload image and get AI analysis
 * POST /api/room-ai/upload
 */
router.post('/upload', (req, res, next) => {
  getUploadMiddleware()(req, res, (err) => {
    if (err) {
      console.error('[RoomAI] Upload middleware error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, uploadAndAnalyzeImage);

/**
 * Get user's analysis history
 * GET /api/room-ai/history
 */
router.get('/history', getAnalysisHistory);

/**
 * Save a design recommendation
 * POST /api/room-ai/save
 */
router.post('/save', saveDesignRecommendation);

/**
 * Get style statistics and trends
 * GET /api/room-ai/stats
 */
router.get('/stats', getStyleStatistics);

module.exports = router;
