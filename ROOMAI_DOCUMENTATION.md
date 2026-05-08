# 🏠 RoomAI - Advanced AI-Powered Interior Design System

## Overview

RoomAI is an advanced AI-powered interior design system for FurniAI Hub that intelligently analyzes room images and provides personalized furniture recommendations. It uses computer vision techniques to detect colors, room types, and design styles, then matches users with perfectly coordinated furniture.

---

## 🎯 Key Features

### 1. **Smart Image Analysis**
- Upload room photos (JPEG, PNG, WebP)
- AI extracts dominant colors from images
- Automatic room type detection (bedroom, living room, office, etc.)
- Design style identification (modern, classic, minimal, luxury)

### 2. **Intelligent Recommendations**
- Smart product matching based on detected characteristics
- Harmony score calculation (0-100)
- Complete room bundle suggestions
- Budget-friendly alternatives

### 3. **Advanced UI/UX**
- Drag-and-drop image upload
- Real-time image analysis with animated loading states
- Before/After visualization mode
- Responsive design for all devices
- Premium animations and transitions

### 4. **User Features**
- Save favorite designs
- View analysis history
- Filter recommendations (Best Match, Budget)
- Social sharing capabilities

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js + Express.js
- **Image Processing**: Sharp (color extraction, resizing)
- **Database**: MySQL
- **File Upload**: Multer (5MB limit, validated)

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS + Custom CSS
- **HTTP Client**: Axios
- **State Management**: React Hooks

### Database
- **room_analysis table**: Stores analysis results
- **products table**: Enhanced with furniture_category and design_style
- **Indexes**: Optimized for user queries

---

## 📊 Database Schema

### room_analysis Table
```sql
CREATE TABLE room_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    image_url VARCHAR(500) NOT NULL,
    detected_color VARCHAR(50),
    detected_style ENUM(...),
    detected_room_type ENUM(...),
    harmony_score INT,
    analysis_data JSON,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_date (user_id, created_at)
);
```

### products Table Updates
```sql
ALTER TABLE products ADD COLUMN furniture_category ENUM(
    'sofa', 'bed', 'chair', 'table', 'wardrobe', 
    'desk', 'lamp', 'rug', 'decoration', 'other'
) DEFAULT 'other';

ALTER TABLE products ADD COLUMN design_style ENUM(
    'modern', 'classic', 'minimal', 'luxury', 
    'industrial', 'rustic', 'contemporary'
) DEFAULT 'modern';
```

---

## 🔌 API Endpoints

### Upload & Analyze
**POST** `/api/room-ai/upload`
- **Body**: multipart/form-data (image file)
- **Returns**: Analysis with recommendations

```json
{
  "success": true,
  "analysis": {
    "imageUrl": "/uploads/image-123.jpg",
    "detectedColor": "brown",
    "detectedStyle": "classic",
    "roomType": "living room",
    "harmonyScore": 85
  },
  "recommendations": [...],
  "bundles": {...},
  "explanation": "..."
}
```

### Get Analysis History
**GET** `/api/room-ai/history`
- **Auth**: Required (JWT)
- **Returns**: User's 10 most recent analyses

### Save Design
**POST** `/api/room-ai/save`
- **Body**: `{ analysisId, products }`
- **Returns**: Success confirmation

### Get Statistics
**GET** `/api/room-ai/stats`
- **Returns**: Style distribution and trends

---

## 🎨 Color Detection System

### Supported Colors
- Brown family (furniture primary)
- White/Beige (minimal, modern)
- Black (luxury, modern)
- Gold/Silver (luxury, classic)
- Red, Blue, Green, Orange, Purple

### Algorithm
1. Resize image to 100x100px
2. Extract RGB values from all pixels
3. Build color frequency map
4. Find dominant color
5. Normalize to predefined palette

---

## 🏠 Room Detection Logic

### Detection Methods
1. **Filename Analysis**: Keywords (bed→bedroom, sofa→living_room)
2. **Color Context**: Combined with brightness
3. **Furniture Detection**: ML-ready (can integrate TensorFlow.js)
4. **User Input**: Optional user confirmation

### Supported Room Types
- Bedroom
- Living Room
- Office
- Kitchen
- Dining Room
- Bathroom

---

## ✨ Design Style Detection

### Style Categories

| Style | Color Palette | Brightness |
|-------|--------------|-----------|
| **Luxury** | Black, Gold, Crimson, Purple | Low (< 100) |
| **Minimal** | White, Beige, Silver | High (> 200) |
| **Classic** | Brown, Gold, Beige | Medium |
| **Modern** | Black, White, Silver, Gray | Variable |
| **Rustic** | Brown, Orange, Gold | Medium-Low |

---

## 📈 Harmony Score Calculation

```javascript
Score = 
  (40 × colorMatch) +
  (30 × styleMatch) +
  (30 × categoryMatch)
  
Where each match = 1 for exact, 0.5 for partial
Max Score = 100
```

### Scoring Breakdown
- **40 points**: Color match
- **30 points**: Design style match
- **30 points**: Furniture category relevance

---

## 🚀 Setup Instructions

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Create Uploads Directory**
```bash
mkdir uploads
```

3. **Update Database**
```bash
mysql -u root -p < db_schema.sql
```

4. **Start Server**
```bash
node server.js
# Server runs on http://localhost:5000
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Update API Base URL** (if needed)
- Edit `frontend/src/services/api.js`
- Default: `http://localhost:5000`

3. **Start Development Server**
```bash
npm run dev
# App runs on http://localhost:5173
```

---

## 📁 Project Structure

```
backend/
├── controllers/
│   └── roomAIController.js
├── routes/
│   └── roomAIRoutes.js
├── utils/
│   └── roomAILogic.js
├── uploads/              # Generated at runtime
└── server.js             # Register routes

frontend/
├── components/
│   ├── RoomAI.jsx
│   ├── RoomAI.css
│   └── Navbar.jsx       # Updated with link
├── pages/
│   └── ...
└── App.jsx              # Route added
```

---

## 🎯 Usage Flow

### User Journey
1. **Navigate** to `/room-ai`
2. **Upload** room image (drag-drop or click)
3. **Analyze** with AI
4. **View** detected attributes
5. **Browse** recommendations
6. **Filter** by preference
7. **Save** favorite designs
8. **Add to Cart** selected items

### Admin/Staff
- View analytics at `/api/room-ai/stats`
- Monitor user trends
- Optimize product catalog

---

## 🔐 Security Features

### File Upload Security
- Whitelist MIME types (JPEG, PNG, WebP)
- Size limit: 5MB
- Unique filename generation
- Path traversal prevention

### Data Privacy
- User ID linked to analyses
- Encrypted image storage paths
- JWT authentication for history
- GDPR-ready data deletion

---

## 🎨 UI/UX Features

### Interactive Elements
- **Upload Area**: Hover effects, drag-drop
- **Loading State**: Animated spinner + progress steps
- **Results Animation**: Fade-in, slide-up effects
- **Responsive Grid**: Auto-layout for all screen sizes
- **Smooth Transitions**: 0.3s-0.8s durations

### Color Indicators
- **Harmony Score Bar**: Gradient progress fill
- **Color Badge**: Visual color dot
- **Match Badges**: Green gradient badges
- **Error Messages**: Red left border, shake animation

---

## 🧪 Testing Checklist

- [ ] Upload various room images
- [ ] Verify color detection accuracy
- [ ] Check harmony score calculations
- [ ] Test all filters (all, best-match, budget)
- [ ] Verify recommendations display correctly
- [ ] Test save functionality
- [ ] Check responsive on mobile
- [ ] Verify error handling (large files, invalid formats)
- [ ] Test before/after toggle
- [ ] Validate API responses

---

## 🚀 Performance Optimization

### Current Optimizations
- Image resize before processing (100x100px)
- Lazy loading of product images
- Database indexing on user_id, created_at
- Image format conversion with Sharp

### Future Improvements
- CDN for image serving
- Redis caching for frequently analyzed colors
- ML model optimization
- Progressive image loading
- Image compression on upload

---

## 🐛 Troubleshooting

### Image Upload Fails
- Check file size (max 5MB)
- Verify MIME type (JPEG, PNG, WebP)
- Ensure `/uploads` directory exists
- Check file permissions

### API Errors
- Verify backend server running on port 5000
- Check database connection
- Review error logs in console
- Validate JSON request body

### Poor Color Detection
- Use good lighting in photos
- Ensure clear furniture visibility
- Avoid very dark/bright images
- Verify Sharp installation

---

## 📝 Future Enhancements

### Phase 2
- [ ] TensorFlow.js for ML-based room detection
- [ ] AR visualization (see furniture in room)
- [ ] Voice commands for analysis
- [ ] 3D room configurator

### Phase 3
- [ ] Social sharing & Pinterest integration
- [ ] Design challenges & leaderboards
- [ ] AI chat assistant
- [ ] Professional designer consultation booking

### Phase 4
- [ ] Mobile app (React Native)
- [ ] Video analysis support
- [ ] Real-time multi-user collab
- [ ] AI-generated room renders

---

## 📞 Support & Documentation

### API Documentation
- Full OpenAPI/Swagger coming soon
- Postman collection: `room-ai.postman_collection.json`

### Code Examples

**React Hook**
```jsx
const [analysis, setAnalysis] = useState(null);
const handleAnalyze = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const res = await axios.post('/api/room-ai/upload', formData);
  setAnalysis(res.data);
};
```

**Backend Usage**
```js
const { extractDominantColor } = require('./utils/roomAILogic');
const color = await extractDominantColor(imageBuffer);
```

---

## 📄 License & Credits

- Built for FurniAI Hub
- Uses Sharp.js for image processing
- Tailwind CSS for styling
- React + Express stack

---

## ✅ Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] Image upload directory created
- [ ] CORS properly configured
- [ ] API endpoints tested
- [ ] Frontend routes verified
- [ ] Performance optimized
- [ ] Error handling in place
- [ ] Logging configured
- [ ] Security headers enabled

---

**RoomAI** - Transform spaces with intelligent interior design recommendations! 🎨✨
