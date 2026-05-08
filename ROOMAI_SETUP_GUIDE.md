# 🚀 RoomAI Integration & Setup Guide

## Quick Start (5 Minutes)

### 1. Database Updates
```bash
# Apply schema changes
mysql -u root -p furni_ai_hub < backend/db_schema.sql
```

### 2. Backend Installation
```bash
cd backend
npm install
mkdir -p uploads
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access RoomAI
Navigate to: `http://localhost:5173/room-ai`

---

## 📋 Configuration Guide

### Backend Environment (.env)
```bash
# database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=furni_ai_hub

# server
PORT=5000
NODE_ENV=development

# file upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp
```

### Frontend API Configuration
File: `frontend/src/services/api.js`
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 
                     'http://localhost:5000';
```

---

## 🔧 Feature Configuration

### Color Detection Sensitivity
File: `backend/utils/roomAILogic.js`
```javascript
// Adjust color matching distance threshold
const DISTANCE_THRESHOLD = 50; // Lower = stricter matching
```

### Room Bundle Categories
File: `backend/utils/roomAILogic.js`
```javascript
const ROOM_BUNDLES = {
  bedroom: ['bed', 'chair', 'table', 'wardrobe', 'lamp'],
  living_room: ['sofa', 'table', 'chair', 'lamp', 'rug'],
  // ... more rooms
};
```

### Harmony Score Weights
File: `backend/utils/roomAILogic.js`
```javascript
// Adjust scoring weights (default: 40-30-30)
const COLOR_WEIGHT = 40;
const STYLE_WEIGHT = 30;
const CATEGORY_WEIGHT = 30;
```

---

## 🛠️ Development Workflow

### File Structure Reminder
```
furni-ai/
├── backend/
│   ├── controllers/
│   │   ├── roomAIController.js      ← Main handler
│   │   └── ...
│   ├── routes/
│   │   ├── roomAIRoutes.js          ← API routes
│   │   └── ...
│   ├── utils/
│   │   ├── roomAILogic.js           ← AI logic
│   │   └── ...
│   ├── uploads/                      ← Generated
│   ├── db_schema.sql                 ← Updated
│   ├── server.js                     ← Updated
│   └── package.json                  ← Updated
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── RoomAI.jsx             ← Main component
    │   │   ├── RoomAI.css             ← Styling
    │   │   ├── Navbar.jsx             ← Updated
    │   │   └── ...
    │   ├── App.jsx                    ← Route added
    │   └── ...
    └── ...
```

### Making Changes

**To modify AI logic**:
1. Edit `backend/utils/roomAILogic.js`
2. Test with sample images
3. Verify database schema matches

**To update UI**:
1. Edit `frontend/src/components/RoomAI.jsx`
2. Update styles in `RoomAI.css`
3. Test responsive design

**To add new endpoints**:
1. Add function in `controllers/roomAIController.js`
2. Register route in `routes/roomAIRoutes.js`
3. Add to frontend API calls

---

## 🧪 Testing Guide

### Test Image Categories

**Good Test Images**:
- Clear room photos with distinct furniture
- Good lighting, visible colors
- Clear background
- Single room focus

**Challenge Test Images**:
- Dark rooms (test brightness detection)
- Multiple styles (test accuracy)
- Cluttered spaces (test detection)
- Different angles

### Manual Testing Steps

1. **Color Detection**
   ```
   Upload: Brown/beige room
   Expected: Detected color "brown" or "beige"
   ```

2. **Style Matching**
   ```
   Upload: Modern living room (white, black)
   Expected: Style = "modern"
   ```

3. **Harmony Score**
   ```
   Upload: Sofa image
   Expected: Score 70-100% for sofa products
   ```

4. **Recommendations**
   ```
   Upload: Bedroom
   Expected: Beds, chairs, nightstands recommended
   ```

### API Testing with cURL

```bash
# Upload image
curl -X POST http://localhost:5000/api/room-ai/upload \
  -F "image=@/path/to/image.jpg"

# Get history
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:5000/api/room-ai/history

# Get stats
curl http://localhost:5000/api/room-ai/stats
```

### Frontend Component Testing

```javascript
// Test color detection
import { normalizeDominantColor } from './utils/roomAILogic';
console.log(normalizeDominantColor('#8B4513')); // Should log "brown"

// Test harmony score
import { calculateHarmonyScore } from './utils/roomAILogic';
const score = calculateHarmonyScore(product, 'brown', 'classic', 'bedroom');
console.log(score); // Should be 0-100
```

---

## 📊 Performance Tips

### Optimize Image Processing
```javascript
// Resize smaller for faster analysis
const resized = await sharp(imageBuffer)
  .resize(50, 50)  // Reduce from 100x100
  .raw()
  .toBuffer();
```

### Database Optimization
```sql
-- Already indexed, but verify
SHOW INDEX FROM room_analysis;

-- Add additional if needed
CREATE INDEX idx_color ON room_analysis(detected_color);
CREATE INDEX idx_style ON room_analysis(detected_style);
```

### Frontend Performance
```javascript
// Lazy load product images
<img loading="lazy" src={url} />

// Memoize components
const ProductCard = React.memo(({ product }) => {...});

// Use React.lazy for code splitting
const RoomAI = React.lazy(() => import('./components/RoomAI'));
```

---

## 🔐 Security Hardening

### File Upload Security
```javascript
// Already implemented in roomAIController.js
const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Validate always
if (!allowedMimes.includes(file.mimetype)) {
  return res.status(400).json({ error: 'Invalid file type' });
}
```

### API Security
```javascript
// Add rate limiting
const rateLimit = require('express-rate-limit');
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                   // 10 uploads per 15 min
});

router.post('/upload', uploadLimiter, uploadAndAnalyzeImage);
```

### Input Validation
```javascript
// Validate user input
const { body, validationResult } = require('express-validator');

router.post('/save', [
  body('analysisId').isInt(),
  body('products').isArray(),
], saveDesignRecommendation);
```

---

## 🚨 Error Handling

### Common Issues & Solutions

**Issue**: "Image processing failed"
```
Solution: Check Sharp installation
npm ls sharp
npm rebuild sharp
```

**Issue**: "Cannot find module 'multer'"
```
Solution: Install missing dependency
npm install multer --save
```

**Issue**: "Database connection failed"
```
Solution: Verify credentials
mysql -u root -p
USE furni_ai_hub;
SELECT * FROM room_analysis LIMIT 1;
```

**Issue**: "CORS errors"
```
Solution: Update CORS in server.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

**Issue**: "File upload too large"
```
Solution: Increase limit in roomAIController.js
limits: { fileSize: 10 * 1024 * 1024 } // 10MB
```

---

## 📈 Analytics & Monitoring

### Database Queries

**Most analyzed colors**:
```sql
SELECT detected_color, COUNT(*) as count
FROM room_analysis
GROUP BY detected_color
ORDER BY count DESC;
```

**Popular styles**:
```sql
SELECT detected_style, AVG(harmony_score) as avg_score
FROM room_analysis
GROUP BY detected_style;
```

**User trends**:
```sql
SELECT user_id, COUNT(*) as analyses
FROM room_analysis
GROUP BY user_id
ORDER BY analyses DESC
LIMIT 10;
```

### Logging

Add to backend:
```javascript
const fs = require('fs');

function logAnalysis(analysis) {
  const log = `[${new Date().toISOString()}] ${JSON.stringify(analysis)}\n`;
  fs.appendFileSync('./analysis-logs.txt', log);
}
```

---

## 🎓 Advanced Features

### Adding ML Integration (Future)

**TensorFlow.js Setup**:
```javascript
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');

async function detectFurniture(imageBuffer) {
  const model = await mobilenet.load();
  const predictions = await model.classify(imageBuffer);
  return predictions;
}
```

### Custom Color Palettes

Extend `COLOR_PALETTE` in `roomAILogic.js`:
```javascript
const COLOR_PALETTE = {
  // ... existing colors
  '#FF69B4': 'pink',
  '#00CED1': 'turquoise',
  '#4B0082': 'indigo',
};
```

### Style-Specific Rules

Create custom detection:
```javascript
function detectStyleAdvanced(color, furniture, layout) {
  if (layout === 'open' && furniture.includes('sofa')) {
    return 'modern';
  }
  // ... more rules
}
```

---

## 📚 Resources

### Documentation
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [React Hooks Guide](https://react.dev/reference/react)
- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)
- [MySQL Query Guide](https://dev.mysql.com/doc/)

### Related Features
- Cart system: `frontend/src/context/CartContext.jsx`
- Authentication: `backend/routes/authRoutes.js`
- Products: `backend/controllers/productController.js`

### Community
- GitHub: FurniAI Hub repository
- Issues: Use GitHub Issues for bugs
- Discussions: GitHub Discussions for features

---

## ✅ Pre-Deployment Checklist

- [ ] All database migrations applied
- [ ] Environment variables configured
- [ ] Image upload directory permissions set (755)
- [ ] Backend server tested on production port
- [ ] Frontend build tested (`npm run build`)
- [ ] API endpoints documented
- [ ] Error handling comprehensive
- [ ] Rate limiting configured
- [ ] Database backups scheduled
- [ ] Monitoring/logging in place
- [ ] Security headers enabled
- [ ] CORS configured for production
- [ ] SSL/HTTPS enabled
- [ ] Load testing completed

---

## 🎯 Next Steps

1. **Install & Setup**: Follow Quick Start (5 min)
2. **Test Features**: Use Testing Guide (10 min)
3. **Customize**: Adjust colors, styles, weights (15 min)
4. **Deploy**: Use Pre-Deployment Checklist (30 min)
5. **Monitor**: Track analytics & user feedback (ongoing)

---

**Happy Interior Designing! 🏠✨**

For questions or support, refer to ROOMAI_DOCUMENTATION.md
