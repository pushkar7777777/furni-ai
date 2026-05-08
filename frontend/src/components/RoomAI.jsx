/**
 * RoomAI Component
 * Interactive AI-powered interior design recommendations.
 */

import React, { useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Eye,
  ImagePlus,
  LoaderCircle,
  RefreshCw,
  Save,
  SlidersHorizontal,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './RoomAI.css';

const API_ORIGIN = '';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'best-match', label: 'Best Match' },
  { id: 'budget', label: 'Budget' },
];

const roomConceptImages = {
  bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1400&auto=format&fit=crop',
  'living room': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop',
  living_room: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop',
  office: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1400&auto=format&fit=crop',
  kitchen: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1400&auto=format&fit=crop',
  bathroom: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1400&auto=format&fit=crop',
  'dining room': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1400&auto=format&fit=crop',
  dining_room: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1400&auto=format&fit=crop',
};

const categoryImages = {
  sofa: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=900&auto=format&fit=crop',
  bed: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=900&auto=format&fit=crop',
  chair: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=900&auto=format&fit=crop',
  table: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=900&auto=format&fit=crop',
  wardrobe: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=900&auto=format&fit=crop',
  desk: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=900&auto=format&fit=crop',
  lamp: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=900&auto=format&fit=crop',
  rug: 'https://images.unsplash.com/photo-1594040226829-7f251ab46d80?q=80&w=900&auto=format&fit=crop',
  decoration: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=900&auto=format&fit=crop',
  other: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=900&auto=format&fit=crop',
};

const styleImages = {
  modern: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=900&auto=format&fit=crop',
  classic: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=900&auto=format&fit=crop',
  minimal: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=900&auto=format&fit=crop',
  luxury: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=900&auto=format&fit=crop',
  industrial: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=900&auto=format&fit=crop',
  rustic: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=900&auto=format&fit=crop',
  contemporary: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=900&auto=format&fit=crop',
};

const RoomAI = () => {
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [comparePosition, setComparePosition] = useState(52);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeProductId, setActiveProductId] = useState(null);
  const [savedDesign, setSavedDesign] = useState(false);
  const fileInputRef = useRef(null);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const filteredRecommendations = useMemo(() => {
    switch (selectedFilter) {
      case 'best-match':
        return [...recommendations].sort((a, b) => b.harmonyScore - a.harmonyScore).slice(0, 4);
      case 'budget':
        return [...recommendations].sort((a, b) => Number(a.price) - Number(b.price)).slice(0, 4);
      default:
        return recommendations;
    }
  }, [recommendations, selectedFilter]);

  const activeProduct = useMemo(
    () => recommendations.find((product) => product.id === activeProductId) || filteredRecommendations[0],
    [activeProductId, filteredRecommendations, recommendations]
  );

  const roomBundle = useMemo(() => groupProductsByCategory(recommendations), [recommendations]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB.');
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setSavedDesign(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleImageSelect({ target: { files: e.dataTransfer.files } });
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) {
      setError('Please select an image first.');
      return;
    }

    setLoading(true);
    setStep(2);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await axios.post(`/api/room-ai/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        const nextRecommendations = response.data.recommendations || [];
        setAnalysis(response.data.analysis);
        setRecommendations(nextRecommendations);
        setActiveProductId(nextRecommendations[0]?.id || null);
        setShowBeforeAfter(true);
        setStep(3);
        addToast({
          title: 'Room analyzed',
          message: 'Your recommendations are ready.',
          variant: 'success',
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze image. Please make sure the backend is running.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!localStorage.getItem('user_id')) {
      addToast({
        title: 'Login required',
        message: 'Please log in before adding items to your cart.',
        variant: 'info',
      });
      return;
    }

    try {
      await addToCart(product.id, 1);
      addToast({
        title: 'Added to cart',
        message: `${product.name} is now in your cart.`,
        variant: 'success',
      });
    } catch (err) {
      addToast({
        title: 'Cart update failed',
        message: err.response?.data?.error || 'Unable to add this product right now.',
        variant: 'error',
      });
    }
  };

  const handleSaveDesign = () => {
    const saved = {
      analysis,
      recommendations,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('room_ai_saved_design', JSON.stringify(saved));
    setSavedDesign(true);
    addToast({
      title: 'Design saved',
      message: 'Your RoomAI concept was saved on this device.',
      variant: 'success',
    });
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setStep(1);
    setSelectedImage(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setRecommendations([]);
    setError(null);
    setShowBeforeAfter(false);
    setComparePosition(52);
    setSelectedFilter('all');
    setActiveProductId(null);
    setSavedDesign(false);
  };

  return (
    <div className="room-ai-container">
      <div className="room-ai-header">
        <div className="header-content">
          <div className="room-ai-kicker">
            <Sparkles className="kicker-icon" />
            Neural Design Studio
          </div>
          <h1 className="ai-title">RoomAI Design Studio</h1>
          <p className="ai-subtitle">
            Upload a room photo, compare a styled concept, and shop matching furniture instantly.
          </p>
        </div>
        <div className="hero-room-strip" aria-hidden="true">
          {Object.values(roomConceptImages).slice(0, 5).map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt="" />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="upload-section">
          <div className="upload-container">
            <div
              className={`upload-area ${isDragging ? 'drag-active' : ''} ${previewUrl ? 'has-preview' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
              }}
            >
              <div className="upload-content">
                <div className="upload-icon">
                  <Camera />
                </div>
                <h2>{previewUrl ? 'Room Photo Selected' : 'Upload Your Room Photo'}</h2>
                <p>{previewUrl ? selectedImage?.name : 'Drag and drop your image or click to browse'}</p>
                <p className="upload-hint">JPEG, PNG, WebP. Maximum 5MB.</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
            </div>

            {previewUrl && (
              <div className="preview-section">
                <div className="preview-frame">
                  <img src={previewUrl} alt="Selected room preview" className="preview-image" />
                  <div className="preview-badge">
                    <CheckCircle2 />
                    Ready
                  </div>
                </div>
                <div className="preview-actions">
                  <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
                    <ImagePlus className="btn-icon" />
                    Change Image
                  </button>
                </div>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <button className="btn btn-primary btn-lg" onClick={handleAnalyzeImage} disabled={!selectedImage || loading}>
              {loading ? <LoaderCircle className="btn-icon spin-icon" /> : <Wand2 className="btn-icon" />}
              Analyze My Room
            </button>
          </div>

          <div className="info-grid">
            {[
              ['Color Detection', 'AI identifies dominant tones and palette direction.'],
              ['Room Recognition', 'The layout is matched to useful furniture groups.'],
              ['Style Matching', 'Recommendations are scored by style and color harmony.'],
              ['Instant Shopping', 'Open product pages or add complete-room picks to cart.'],
            ].map(([title, copy], index) => (
              <div key={title} className="info-card" style={{ animationDelay: `${index * 80}ms` }}>
                <div className="info-icon">{index + 1}</div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="loading-section">
          <div className="loader">
            <div className="loader-inner" />
          </div>
          <h2>Analyzing your room</h2>
          <p>Extracting colors, reading style, and arranging product matches.</p>
          <div className="loading-steps">
            {['Scanning image', 'Detecting palette', 'Mapping room type', 'Scoring furniture'].map((label, index) => (
              <div key={label} className="step" style={{ animationDelay: `${index * 120}ms` }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && analysis && (
        <div className="results-section">
          <div className="summary-grid">
            <SummaryCard label="Detected Color" value={analysis.detectedColor}>
              <span className="color-dot" style={{ backgroundColor: getColorHex(analysis.detectedColor) }} />
            </SummaryCard>
            <SummaryCard label="Design Style" value={analysis.detectedStyle} />
            <SummaryCard label="Room Type" value={analysis.roomType} />
            <SummaryCard label="Harmony Score" value={`${analysis.harmonyScore}%`}>
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${analysis.harmonyScore}%` }} />
              </div>
            </SummaryCard>
          </div>

          <div className="results-controls">
            <button
              className={`control-btn ${showBeforeAfter ? 'active' : ''}`}
              onClick={() => setShowBeforeAfter((current) => !current)}
            >
              <Eye className="control-icon" />
              Before / After
            </button>

            <div className="filter-tabs" aria-label="Recommendation filters">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`filter-tab ${selectedFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {showBeforeAfter && (
            <div className="comparison-panel">
              <div className="comparison-stage">
                <img src={getImageUrl(analysis.imageUrl)} alt="Original uploaded room" className="comparison-image" />
                <div className="after-layer" style={{ clipPath: `inset(0 0 0 ${comparePosition}%)` }}>
                  <img src={getConceptRoomImage(analysis)} alt="Styled room concept" className="comparison-image styled" />
                  <div className="design-overlay">
                    <div className="palette-chip" style={{ backgroundColor: getColorHex(analysis.detectedColor) }} />
                    <div>
                      <strong>{formatCategory(analysis.detectedStyle)} Concept</strong>
                      <span>{activeProduct?.name || 'Curated furniture layout'}</span>
                    </div>
                  </div>
                  <div className="floating-products">
                    {recommendations.slice(0, 3).map((product) => (
                      <button
                        key={product.id}
                        className={`floating-product ${activeProduct?.id === product.id ? 'active' : ''}`}
                        onClick={() => setActiveProductId(product.id)}
                      >
                        <img src={getProductImage(product)} alt="" />
                        <span>{Math.round(product.harmonyScore || 0)}%</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="compare-handle" style={{ left: `${comparePosition}%` }}>
                  <SlidersHorizontal />
                </div>
              </div>
              <input
                className="compare-slider"
                type="range"
                min="8"
                max="92"
                value={comparePosition}
                onChange={(e) => setComparePosition(Number(e.target.value))}
                aria-label="Before and after comparison position"
              />
              <div className="comparison-labels">
                <span>Before</span>
                <span>After</span>
              </div>
              <div className="explanation">
                <p>{analysis.explanation}</p>
              </div>
            </div>
          )}

          <div className="recommendations-section">
            <div className="section-heading-row">
              <h2>Recommended Furniture</h2>
              <span>{filteredRecommendations.length} items</span>
            </div>
            <div className="products-grid">
              {filteredRecommendations.map((product, index) => (
                <div
                  key={product.id}
                  className={`product-card ${activeProduct?.id === product.id ? 'active' : ''}`}
                  style={{ animationDelay: `${index * 70}ms` }}
                  onMouseEnter={() => setActiveProductId(product.id)}
                >
                  <div className="product-image">
                    <img src={getProductImage(product)} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <p className="product-category">{formatCategory(product.furniture_category)}</p>
                    <h3>{product.name}</h3>
                    <div className="product-details">
                      <span className="price">Rs {Number(product.price).toLocaleString()}</span>
                      <span className="harmony-badge">{Math.round(product.harmonyScore || 0)}% Match</span>
                    </div>
                    <div className="card-actions">
                      <Link className="btn btn-small btn-secondary" to={`/products/${product.id}`}>
                        View Details
                        <ArrowRight className="btn-icon" />
                      </Link>
                      <button className="btn btn-small btn-primary" onClick={() => handleAddToCart(product)}>
                        <Sparkles className="btn-icon" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {Object.keys(roomBundle).length > 0 && (
            <div className="complete-room-section">
              <div className="section-heading-row">
                <h2>Complete Room Setup</h2>
                <span>Curated bundle</span>
              </div>
              <div className="bundles-grid">
                {Object.entries(roomBundle).map(([category, product], index) => (
                  <div key={`${category}-${product.id}`} className="bundle-card" style={{ animationDelay: `${index * 80}ms` }}>
                    <div className="bundle-category">{formatCategory(category)}</div>
                    <img src={getProductImage(product)} alt={product.name} />
                    <h4>{product.name}</h4>
                    <p className="bundle-price">Rs {Number(product.price).toLocaleString()}</p>
                    <button className="btn btn-small btn-primary" onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="results-actions">
            <button className={`btn btn-primary ${savedDesign ? 'saved' : ''}`} onClick={handleSaveDesign}>
              <Save className="btn-icon" />
              {savedDesign ? 'Design Saved' : 'Save This Design'}
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              <RefreshCw className="btn-icon" />
              Analyze Another Room
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function SummaryCard({ label, value, children }) {
  return (
    <div className="summary-card">
      <div className="summary-label">{label}</div>
      <div className="summary-value">
        {children}
        <span>{value}</span>
      </div>
    </div>
  );
}

function getColorHex(colorName = '') {
  const colorMap = {
    brown: '#8B4513',
    white: '#FFFFFF',
    black: '#000000',
    beige: '#F5F5DC',
    gold: '#FFD700',
    red: '#FF6347',
    blue: '#4169E1',
    green: '#228B22',
    purple: '#8B008B',
    orange: '#FFA500',
    silver: '#C0C0C0',
  };
  return colorMap[colorName.toLowerCase()] || '#BEBEBE';
}

function getImageUrl(imageUrl) {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http') || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) return imageUrl;
  // Uploaded image — serve via proxy /api route or directly from backend
  return imageUrl;
}

function isPlaceholderImage(imageUrl = '') {
  return !imageUrl || imageUrl.includes('placeholder.com') || imageUrl.includes('/products/');
}

function getProductImage(product = {}) {
  if (!isPlaceholderImage(product.image_url)) return getImageUrl(product.image_url);

  const category = String(product.furniture_category || '').toLowerCase();
  const style = String(product.design_style || '').toLowerCase();
  const name = String(product.name || '').toLowerCase();

  if (categoryImages[category]) return categoryImages[category];
  if (styleImages[style]) return styleImages[style];
  if (name.includes('sofa') || name.includes('couch')) return categoryImages.sofa;
  if (name.includes('bed')) return categoryImages.bed;
  if (name.includes('chair')) return categoryImages.chair;
  if (name.includes('table')) return categoryImages.table;
  if (name.includes('wardrobe')) return categoryImages.wardrobe;
  if (name.includes('desk')) return categoryImages.desk;
  if (name.includes('lamp') || name.includes('light')) return categoryImages.lamp;
  if (name.includes('rug') || name.includes('carpet')) return categoryImages.rug;

  return categoryImages.other;
}

function getConceptRoomImage(analysis = {}) {
  const roomType = String(analysis.roomType || '').toLowerCase();
  const style = String(analysis.detectedStyle || '').toLowerCase();
  return roomConceptImages[roomType] || styleImages[style] || roomConceptImages.living_room;
}

function formatCategory(category = 'other') {
  return category
    .replace('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function groupProductsByCategory(products) {
  return products.reduce((grouped, product) => {
    const category = product.furniture_category || 'other';
    if (!grouped[category]) grouped[category] = product;
    return grouped;
  }, {});
}

export default RoomAI;
