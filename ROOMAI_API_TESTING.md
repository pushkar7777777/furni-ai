/**
 * RoomAI API Testing Guide
 * Use these commands to test all RoomAI endpoints
 */

// ============================================
// 1. UPLOAD & ANALYZE IMAGE
// ============================================

// Using curl (replace with actual image path)
curl -X POST http://localhost:5000/api/room-ai/upload \
  -F "image=@/path/to/room-image.jpg" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

// Response:
// {
//   "success": true,
//   "analysis": {
//     "imageUrl": "/uploads/image-123.jpg",
//     "detectedColor": "brown",
//     "detectedStyle": "classic",
//     "roomType": "living_room",
//     "harmonyScore": 85
//   },
//   "recommendations": [
//     {
//       "id": 1,
//       "name": "Classic Brown Couch",
//       "price": 55999,
//       "furniture_category": "sofa",
//       "design_style": "classic",
//       "harmonyScore": 92.5,
//       ...
//     },
//     ...
//   ],
//   "bundles": {
//     "sofa": { "id": 3, "name": "Classic Brown Couch", "price": 55999, ... },
//     "table": { "id": 14, "name": "Classic Wood Dining Table", "price": 38999, ... },
//     ...
//   },
//   "explanation": "These products match your room's brown color palette and classic style perfectly."
// }

// ============================================
// 2. GET ANALYSIS HISTORY
// ============================================

curl -X GET http://localhost:5000/api/room-ai/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

// Response:
// {
//   "success": true,
//   "history": [
//     {
//       "id": 1,
//       "user_id": 5,
//       "image_url": "/uploads/image-123.jpg",
//       "detected_color": "brown",
//       "detected_style": "classic",
//       "detected_room_type": "living_room",
//       "harmony_score": 85,
//       "analysis_data": "{\"brightness\": 125}",
//       "created_at": "2024-05-05T10:30:00Z"
//     },
//     {
//       "id": 2,
//       "user_id": 5,
//       "image_url": "/uploads/image-456.jpg",
//       "detected_color": "white",
//       "detected_style": "minimal",
//       "detected_room_type": "bedroom",
//       "harmony_score": 78,
//       "analysis_data": "{\"brightness\": 220}",
//       "created_at": "2024-05-04T15:20:00Z"
//     }
//   ]
// }

// ============================================
// 3. SAVE DESIGN RECOMMENDATION
// ============================================

curl -X POST http://localhost:5000/api/room-ai/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "analysisId": 1,
    "products": [3, 14, 11]
  }'

// Response:
// {
//   "success": true,
//   "message": "Design saved successfully",
//   "savedAt": "2024-05-05T10:35:00Z"
// }

// ============================================
// 4. GET STYLE STATISTICS
// ============================================

curl -X GET http://localhost:5000/api/room-ai/stats

// Response:
// {
//   "success": true,
//   "statistics": [
//     {
//       "detected_style": "modern",
//       "detected_room_type": "living_room",
//       "detected_color": "black",
//       "count": 45,
//       "avg_score": 82.3
//     },
//     {
//       "detected_style": "classic",
//       "detected_room_type": "bedroom",
//       "detected_color": "brown",
//       "count": 32,
//       "avg_score": 88.1
//     },
//     {
//       "detected_style": "minimal",
//       "detected_room_type": "office",
//       "detected_color": "white",
//       "count": 28,
//       "avg_score": 75.5
//     }
//   ]
// }

// ============================================
// ERROR RESPONSES
// ============================================

// 400 - No image uploaded
// {
//   "error": "No image uploaded"
// }

// 400 - Invalid file type
// {
//   "error": "Only JPEG, PNG, and WebP images are allowed"
// }

// 413 - File too large
// {
//   "error": "File size exceeds 5MB limit"
// }

// 401 - Unauthorized
// {
//   "error": "Unauthorized"
// }

// 500 - Server error
// {
//   "error": "Image processing failed"
// }

// ============================================
// JAVASCRIPT/FETCH EXAMPLES
// ============================================

/**
 * Upload and analyze image
 */
async function analyzeRoom(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch('http://localhost:5000/api/room-ai/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage:
// const fileInput = document.getElementById('imageInput');
// const file = fileInput.files[0];
// const result = await analyzeRoom(file);
// console.log(result.analysis);
// console.log(result.recommendations);

/**
 * Get user analysis history
 */
async function getAnalysisHistory() {
  try {
    const response = await fetch('http://localhost:5000/api/room-ai/history', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch history: ${response.statusText}`);
    }

    const data = await response.json();
    return data.history;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage:
// const history = await getAnalysisHistory();
// history.forEach(analysis => {
//   console.log(`${analysis.detected_room_type}: ${analysis.harmony_score}%`);
// });

/**
 * Save design recommendation
 */
async function saveDesign(analysisId, productIds) {
  try {
    const response = await fetch('http://localhost:5000/api/room-ai/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({
        analysisId,
        products: productIds
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to save design: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage:
// const result = await saveDesign(1, [3, 14, 11]);
// console.log(result.message);

/**
 * Get statistics
 */
async function getStatistics() {
  try {
    const response = await fetch('http://localhost:5000/api/room-ai/stats', {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }

    const data = await response.json();
    return data.statistics;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage:
// const stats = await getStatistics();
// stats.forEach(stat => {
//   console.log(`${stat.detected_style}: ${stat.count} analyses, avg score: ${stat.avg_score}`);
// });

// ============================================
// AXIOS EXAMPLES (React)
// ============================================

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to requests
API.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Using Axios in React component
 */
async function handleUploadImage(imageFile) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await API.post('/room-ai/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  } catch (error) {
    console.error('Upload error:', error.response?.data || error);
    throw error;
  }
}

async function handleGetHistory() {
  try {
    const response = await API.get('/room-ai/history');
    return response.data.history;
  } catch (error) {
    console.error('History error:', error.response?.data || error);
    throw error;
  }
}

async function handleSaveDesign(analysisId, products) {
  try {
    const response = await API.post('/room-ai/save', {
      analysisId,
      products
    });
    return response.data;
  } catch (error) {
    console.error('Save error:', error.response?.data || error);
    throw error;
  }
}

// ============================================
// PERFORMANCE TESTING
// ============================================

/**
 * Test with multiple images
 */
async function performanceTest() {
  const imageFiles = [
    '/test-images/living-room.jpg',
    '/test-images/bedroom.jpg',
    '/test-images/office.jpg'
  ];

  const results = [];
  const times = [];

  for (const imagePath of imageFiles) {
    const startTime = performance.now();

    try {
      // Fetch image
      const response = await fetch(imagePath);
      const blob = await response.blob();

      // Upload
      const result = await analyzeRoom(blob);
      const endTime = performance.now();

      times.push(endTime - startTime);
      results.push({
        image: imagePath,
        timeMs: endTime - startTime,
        analysis: result.analysis
      });

      console.log(`Processed ${imagePath} in ${endTime - startTime}ms`);
    } catch (error) {
      console.error(`Failed to process ${imagePath}:`, error);
    }
  }

  console.log(`Average time: ${(times.reduce((a, b) => a + b) / times.length).toFixed(2)}ms`);
  return results;
}

// ============================================
// VALIDATION EXAMPLES
// ============================================

/**
 * Validate response format
 */
function validateAnalysisResponse(data) {
  const required = ['success', 'analysis', 'recommendations', 'bundles', 'explanation'];
  const analysisFields = ['imageUrl', 'detectedColor', 'detectedStyle', 'roomType', 'harmonyScore'];

  // Check top-level fields
  for (const field of required) {
    if (!(field in data)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Check analysis object
  for (const field of analysisFields) {
    if (!(field in data.analysis)) {
      throw new Error(`Missing analysis field: ${field}`);
    }
  }

  // Validate harmony score
  if (data.analysis.harmonyScore < 0 || data.analysis.harmonyScore > 100) {
    throw new Error('Harmony score must be between 0 and 100');
  }

  // Validate recommendations array
  if (!Array.isArray(data.recommendations)) {
    throw new Error('Recommendations must be an array');
  }

  return true;
}

// ============================================
// TEST IMAGES URLs (for manual testing)
// ============================================

/*
You can use these test images or provide your own:

Modern Living Room:
- Bright, white walls
- Contemporary furniture
- Minimal decor

Classic Bedroom:
- Warm brown tones
- Traditional furniture
- Ornate details

Industrial Office:
- Dark grays and blacks
- Metal fixtures
- Minimalist setup

Luxury Bathroom:
- Gold/marble accents
- Bright white tiles
- Premium fixtures
*/

// ============================================
// MONITORING DASHBOARD QUERIES
// ============================================

/**
 * SQL queries for monitoring via dashboard
 */

// Most popular room types
// SELECT detected_room_type, COUNT(*) as count
// FROM room_analysis
// GROUP BY detected_room_type
// ORDER BY count DESC;

// Average harmony score by style
// SELECT detected_style, AVG(harmony_score) as avg_score, COUNT(*) as count
// FROM room_analysis
// GROUP BY detected_style
// ORDER BY avg_score DESC;

// Top colors analyzed
// SELECT detected_color, COUNT(*) as count
// FROM room_analysis
// GROUP BY detected_color
// ORDER BY count DESC;

// User engagement
// SELECT user_id, COUNT(*) as analyses, AVG(harmony_score) as avg_score
// FROM room_analysis
// GROUP BY user_id
// ORDER BY analyses DESC
// LIMIT 10;

// ============================================
// END OF API TESTING GUIDE
// ============================================
