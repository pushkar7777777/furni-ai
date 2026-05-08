/**
 * AI Room Design Logic
 * Handles color extraction, room detection, style matching, and recommendations
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Color palette mapping
const COLOR_PALETTE = {
  '#8B4513': 'brown',
  '#A0522D': 'brown',
  '#D2691E': 'brown',
  '#CD853F': 'brown',
  '#DEB887': 'brown',
  '#FFFFFF': 'white',
  '#F5F5F5': 'white',
  '#FFFACD': 'white',
  '#FFF8DC': 'white',
  '#000000': 'black',
  '#1C1C1C': 'black',
  '#2F4F4F': 'black',
  '#F5F5DC': 'beige',
  '#D3D3D3': 'beige',
  '#FFD700': 'gold',
  '#FF6347': 'red',
  '#4169E1': 'blue',
  '#228B22': 'green',
  '#8B008B': 'purple',
  '#FFA500': 'orange',
  '#C0C0C0': 'silver',
  '#DC143C': 'crimson',
};

// Furniture categories by room type
const ROOM_BUNDLES = {
  bedroom: ['bed', 'chair', 'table', 'wardrobe', 'lamp'],
  living_room: ['sofa', 'table', 'chair', 'lamp', 'rug'],
  office: ['desk', 'chair', 'table', 'lamp', 'decoration'],
  kitchen: ['table', 'chair', 'decoration', 'lamp'],
  dining_room: ['table', 'chair', 'decoration', 'lamp'],
  bathroom: ['decoration', 'lamp'],
};

/**
 * Extract dominant colors from image buffer
 */
async function extractDominantColor(imageBuffer) {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    
    // Resize image for faster processing
    const resized = await sharp(imageBuffer)
      .resize(100, 100, {
        fit: 'cover',
      })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = resized;
    
    // Calculate color distribution
    const colorMap = {};
    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const hex = rgbToHex(r, g, b);
      colorMap[hex] = (colorMap[hex] || 0) + 1;
    }

    // Get most dominant color
    let dominantHex = '#FFFFFF';
    let maxCount = 0;
    
    for (const [hex, count] of Object.entries(colorMap)) {
      if (count > maxCount) {
        maxCount = count;
        dominantHex = hex;
      }
    }

    return normalizeDominantColor(dominantHex);
  } catch (error) {
    console.error('Color extraction error:', error);
    return 'beige'; // Default fallback
  }
}

/**
 * Convert RGB to Hex
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

/**
 * Normalize color to predefined categories
 */
function normalizeDominantColor(hex) {
  // Check exact match
  if (COLOR_PALETTE[hex]) {
    return COLOR_PALETTE[hex];
  }

  // Find closest match
  let closestColor = 'beige';
  let closestDistance = Infinity;

  for (const [paletteHex, colorName] of Object.entries(COLOR_PALETTE)) {
    const distance = colorDistance(hex, paletteHex);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestColor = colorName;
    }
  }

  return closestColor;
}

/**
 * Calculate distance between two colors
 */
function colorDistance(hex1, hex2) {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);

  return Math.sqrt(
    Math.pow(r1 - r2, 2) +
    Math.pow(g1 - g2, 2) +
    Math.pow(b1 - b2, 2)
  );
}

/**
 * Convert Hex to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ] : [255, 255, 255];
}

/**
 * Detect room type based on keywords or ML logic
 * Using basic keyword detection
 */
function detectRoomType(imagePath) {
  // In production, use ML model like TensorFlow.js
  // For now, use rule-based detection or filename hints
  
  const roomKeywords = {
    bedroom: ['bed', 'bedroom', 'sleep', 'pillow', 'mattress'],
    living_room: ['sofa', 'couch', 'living', 'lounge', 'tv', 'entertainment'],
    office: ['desk', 'office', 'work', 'chair', 'computer', 'laptop'],
    kitchen: ['kitchen', 'counter', 'stove', 'dining', 'table'],
    bathroom: ['bathroom', 'bath', 'shower', 'sink', 'toilet'],
    dining_room: ['dining', 'table', 'restaurant', 'dinner'],
  };

  // Simple heuristic: analyze image name or use default
  const fileName = path.basename(imagePath).toLowerCase();

  for (const [room, keywords] of Object.entries(roomKeywords)) {
    if (keywords.some(keyword => fileName.includes(keyword))) {
      return room;
    }
  }

  // Default detection based on color and context
  return 'living_room';
}

/**
 * Detect design style based on color brightness and tone
 */
function detectDesignStyle(dominantColor, brightness = 128) {
  const styles = {
    luxury: ['black', 'gold', 'crimson', 'purple'],
    minimal: ['white', 'beige', 'silver'],
    classic: ['brown', 'gold', 'beige'],
    modern: ['black', 'white', 'silver', 'gray'],
    rustic: ['brown', 'orange', 'gold'],
  };

  for (const [style, colors] of Object.entries(styles)) {
    if (colors.includes(dominantColor)) {
      return style;
    }
  }

  // Default based on brightness
  if (brightness > 200) return 'minimal';
  if (brightness < 100) return 'luxury';
  return 'modern';
}

/**
 * Calculate brightness from color
 */
function calculateBrightness(dominantColor) {
  const colorRGB = COLOR_PALETTE[dominantColor] 
    ? Object.keys(COLOR_PALETTE).find(k => COLOR_PALETTE[k] === dominantColor)
    : '#BEBEBE';

  const [r, g, b] = hexToRgb(colorRGB);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * Calculate harmony score for products
 */
function calculateHarmonyScore(product, detectedColor, detectedStyle, roomType) {
  let score = 0;
  let maxScore = 0;

  // Color match: 40 points
  maxScore += 40;
  if (product.color && product.color.toLowerCase().includes(detectedColor)) {
    score += 40;
  } else if (product.color) {
    score += 20; // Partial match
  }

  // Style match: 30 points
  maxScore += 30;
  if (product.design_style === detectedStyle) {
    score += 30;
  } else if (product.design_style) {
    score += 15; // Partial match
  }

  // Category/Furniture type: 30 points
  maxScore += 30;
  if (ROOM_BUNDLES[roomType] && 
      ROOM_BUNDLES[roomType].includes(product.furniture_category)) {
    score += 30;
  } else if (product.furniture_category) {
    score += 10; // Still useful
  }

  return Math.min(100, (score / maxScore) * 100);
}

/**
 * Generate explanation for recommendations
 */
function generateExplanation(detectedColor, detectedStyle, roomType) {
  const explanations = {
    color: `These products match your room's dominant ${detectedColor} color palette.`,
    style: `Selected items complement your ${detectedStyle} interior design style.`,
    room: `Curated furniture perfect for a ${roomType.replace('_', ' ')}.`,
  };

  return [
    explanations.color,
    explanations.style,
    explanations.room,
  ].join(' ');
}

/**
 * Group products by furniture category
 */
function groupProductsByCategory(products, roomType) {
  const bundles = {};
  const relevantCategories = ROOM_BUNDLES[roomType] || ROOM_BUNDLES.living_room;

  for (const category of relevantCategories) {
    bundles[category] = products.find(p => p.furniture_category === category) || null;
  }

  return bundles;
}

/**
 * Filter and rank products for recommendations
 */
function filterAndRankProducts(products, detectedColor, detectedStyle, roomType) {
  // Score each product
  const scoredProducts = products.map(product => ({
    ...product,
    harmonyScore: calculateHarmonyScore(product, detectedColor, detectedStyle, roomType),
  }));

  // Sort by harmony score descending
  scoredProducts.sort((a, b) => b.harmonyScore - a.harmonyScore);

  // Return top 8
  return scoredProducts.slice(0, 8);
}

module.exports = {
  extractDominantColor,
  normalizeDominantColor,
  detectRoomType,
  detectDesignStyle,
  calculateBrightness,
  calculateHarmonyScore,
  generateExplanation,
  groupProductsByCategory,
  filterAndRankProducts,
  COLOR_PALETTE,
  ROOM_BUNDLES,
};
