# 🚀 RoomAI - Quick Reference Card

## Installation (One-Time)

```bash
# Backend
cd backend && npm install && mkdir uploads && node server.js

# Frontend
cd frontend && npm install && npm run dev

# Database
mysql -u root -p < db_schema.sql
mysql -u root -p < backend/sample_products.sql
```

---

## Core Files Map

| File | Purpose | Lines |
|------|---------|-------|
| `backend/controllers/roomAIController.js` | API handlers | 420 |
| `backend/routes/roomAIRoutes.js` | Route definitions | 30 |
| `backend/utils/roomAILogic.js` | AI algorithms | 380 |
| `frontend/src/components/RoomAI.jsx` | UI component | 600+ |
| `frontend/src/components/RoomAI.css` | Styling | 800+ |

---

## API Quick Reference

```bash
# Upload & Analyze
curl -X POST http://localhost:5000/api/room-ai/upload \
  -F "image=@room.jpg"

# Get History
curl http://localhost:5000/api/room-ai/history \
  -H "Authorization: Bearer TOKEN"

# Save Design
curl -X POST http://localhost:5000/api/room-ai/save \
  -H "Content-Type: application/json" \
  -d '{"analysisId": 1, "products": [1,2,3]}'

# Get Stats
curl http://localhost:5000/api/room-ai/stats
```

---

## Key Algorithms

### Color Detection
1. Resize image → 100x100px
2. Extract RGB values
3. Build frequency map
4. Find dominant color
5. Normalize to palette

### Harmony Score
```
Score = (40 × colorMatch + 30 × styleMatch + 30 × categoryMatch) / 100
Range: 0-100%
```

### Room Detection
- Bedroom: bed, pillow, mattress
- Living Room: sofa, couch, tv
- Office: desk, computer, work
- Kitchen: counter, stove, dining
- Bathroom: bath, shower, sink
- Dining Room: dining, table, restaurant

---

## Database Quick Reference

### room_analysis Table
```sql
SELECT * FROM room_analysis WHERE user_id = ? ORDER BY created_at DESC;
```

### Products by Style & Color
```sql
SELECT * FROM products 
WHERE design_style = ? AND furniture_category = ?
LIMIT 8;
```

### Analytics
```sql
SELECT detected_style, AVG(harmony_score) FROM room_analysis GROUP BY detected_style;
```

---

## Environment Setup

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=furni_ai_hub
PORT=5000
```

### Frontend
```javascript
// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:5000';
```

---

## Key Component Props/State

```javascript
// RoomAI.jsx State
const [step, setStep] = useState(1);           // 1:Upload, 2:Loading, 3:Results
const [selectedImage, setSelectedImage] = useState(null);
const [analysis, setAnalysis] = useState(null);
const [recommendations, setRecommendations] = useState(null);
const [loading, setLoading] = useState(false);
const [selectedFilter, setSelectedFilter] = useState('all'); // all, best-match, budget
```

---

## Color Palette (Built-in)

| Color | Hex | Used For |
|-------|-----|----------|
| Brown | #8B4513 | Furniture |
| White | #FFFFFF | Minimal |
| Black | #000000 | Luxury |
| Beige | #F5F5DC | Classic |
| Gold | #FFD700 | Luxury |

---

## Design Styles Supported

| Style | Color Tone | Use Case |
|-------|-----------|----------|
| Modern | Mixed | Contemporary spaces |
| Classic | Warm | Traditional spaces |
| Minimal | Light | Clean, minimalist |
| Luxury | Dark + Gold | Premium spaces |
| Industrial | Dark | Warehouse style |
| Rustic | Brown | Rural aesthetic |
| Contemporary | Variable | Current trends |

---

## Room Types Detected

- Bedroom
- Living Room
- Office
- Kitchen
- Bathroom
- Dining Room

---

## Product Categories

- Sofa
- Bed
- Chair
- Table
- Wardrobe
- Desk
- Lamp
- Rug
- Decoration
- Other

---

## Testing Checklist

```
☐ Upload image (test drag-drop & click)
☐ Verify color detection
☐ Check room type recognition
☐ Confirm style detection
☐ Validate harmony score (0-100)
☐ Test filter options
☐ Check bundle grouping
☐ Test responsive design
☐ Verify error handling
☐ Check save functionality
```

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "No module found" | `npm install` |
| Image processing fails | Check Sharp: `npm rebuild sharp` |
| Database error | Verify credentials & schema |
| CORS errors | Check backend CORS config |
| 404 on route | Register route in server.js |
| File too large | Increase limit in controller |

---

## Performance Tips

```javascript
// Optimize queries
CREATE INDEX idx_user_date ON room_analysis(user_id, created_at);

// Reduce image size
const resized = await sharp(buffer).resize(50, 50).raw().toBuffer();

// Lazy load images
<img loading="lazy" src={url} />
```

---

## Route Structure

```
frontend/src/App.jsx
├── / → Home
├── /products → Products List
├── /room-ai → RoomAI ✨
├── /cart → Shopping Cart
└── /dashboard → Admin Panel
```

---

## File Upload

```javascript
// Max file size: 5MB
// Formats: JPEG, PNG, WebP
// Stored in: /backend/uploads/
// Served from: /uploads/{filename}
```

---

## Security Checklist

- ✓ File type validation
- ✓ Size limits (5MB)
- ✓ Unique filename generation
- ✓ Input validation
- ✓ JWT auth ready
- ✓ Error message obfuscation

---

## Git Commands

```bash
# Add all files
git add .

# Commit changes
git commit -m "Add RoomAI feature"

# Push to production
git push origin main
```

---

## Deployment Steps

1. **Database**: Apply migrations
2. **Backend**: Set env variables, restart
3. **Frontend**: Build & deploy
4. **Monitor**: Check logs & metrics

---

## Documentation Links

- 📖 Full Guide: `ROOMAI_DOCUMENTATION.md`
- 🔧 Setup: `ROOMAI_SETUP_GUIDE.md`
- 🧪 API Testing: `ROOMAI_API_TESTING.md`
- 📋 Completion Report: `ROOMAI_COMPLETION_REPORT.md`

---

## Quick Stats

- **Backend Code**: 830+ lines
- **Frontend Code**: 1400+ lines
- **Documentation**: 1500+ lines
- **Sample Data**: 40+ products
- **API Endpoints**: 4 major routes
- **Features**: 12+ user-facing
- **Animations**: 8+ types

---

## Contact & Support

For issues or questions:
1. Check documentation files
2. Review code comments
3. Check sample data
4. Review API testing guide
5. Check error logs

---

## Next Phase Features

- ML-based room detection (TensorFlow.js)
- AR visualization
- Social sharing
- Design history
- Expert consultation booking
- Mobile app (React Native)

---

## Version Info

- **RoomAI v1.0.0** - Initial Release
- **Node.js**: 14+
- **React**: 18+
- **MySQL**: 5.7+
- **Browser**: Latest Chrome, Firefox, Safari

---

## 🎯 Most Important Commands

```bash
# Start backend
cd backend && node server.js

# Start frontend
cd frontend && npm run dev

# Access app
open http://localhost:5173/room-ai

# Test API
curl http://localhost:5000/api/room-ai/stats
```

---

**Keep this card handy for quick reference! 🚀**
