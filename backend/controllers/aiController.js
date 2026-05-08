const AIModel = require('../models/aiModel');

const buildSuggestions = ({ material, color, count }) => {
  const suggestions = [];

  // Material-specific insights
  if (material) {
    const materialInsights = {
      'Wood': '✓ Natural warmth and timeless elegance. Pairs beautifully with soft textiles and earth tones.',
      'Metal': '✓ Contemporary sophistication. Excellent for modern spaces with minimalist aesthetics.',
      'Glass': '✓ Creates an airy, spacious feel. Perfect for open-plan living with natural light.',
      'Leather': '✓ Luxury and durability. Complements both classic and contemporary interiors.',
      'Fabric': '✓ Comfort and versatility. Works well with various design styles and color schemes.',
      'Marble': '✓ Premium elegance and durability. Ideal for high-traffic areas requiring sophistication.'
    };
    if (materialInsights[material]) {
      suggestions.push(materialInsights[material]);
    }
  }

  // Color-specific insights
  if (color) {
    const colorInsights = {
      'White': '✓ Fresh and clean aesthetic. Maximizes light and creates a serene atmosphere.',
      'Brown': '✓ Warmth and grounding effect. Excellent for creating cozy, inviting spaces.',
      'Black': '✓ Bold and sophisticated. Perfect for creating dramatic, modern interiors.',
      'Beige': '✓ Neutral sophistication. Versatile backdrop for any design style.',
      'Gray': '✓ Modern and versatile. Works as both a neutral base and a statement color.',
      'Natural': '✓ Authentic beauty. Highlights craftsmanship and material authenticity.'
    };
    if (colorInsights[color]) {
      suggestions.push(colorInsights[color]);
    }
  }

  // Combination insights
  if (material && color) {
    const combinations = {
      'Wood-Brown': '✓ Harmonious natural blend creating warmth and timeless comfort.',
      'Metal-Black': '✓ Sleek industrial aesthetic perfect for modern minimalist spaces.',
      'Glass-White': '✓ Bright, airy contemporary combination ideal for light-filled spaces.',
      'Leather-Brown': '✓ Classic luxury pairing with enduring appeal and comfort.',
      'Fabric-Beige': '✓ Soft, welcoming combination perfect for relaxing family spaces.',
      'Marble-White': '✓ Pristine elegance with premium sophistication and durability.'
    };
    const key = `${material}-${color}`;
    if (combinations[key]) {
      suggestions.push(combinations[key]);
    } else if (count && count > 0) {
      suggestions.push(`✓ Found ${count} matching piece${count === 1 ? '' : 's'} for this combination.`);
    }
  }

  if (suggestions.length === 0) {
    suggestions.push('◆ No exact matches found. Consider exploring complementary materials or colors for unique combinations.');
  }

  return suggestions;
};

const aiController = {
  async recommendProducts(req, res) {
    try {
      const { material, color } = req.body;
      const products = await AIModel.recommendProducts({ material, color });
      res.json(products);
    } catch (err) {
      console.error('AI recommendation error:', err);
      res.status(500).json({ error: 'AI recommendation failed', details: err.message });
    }
  },

  async recommend(req, res) {
    try {
      const { material, color } = req.body;
      
      if (!material && !color) {
        return res.status(400).json({ 
          error: 'Please provide at least material or color',
          suggestions: []
        });
      }

      const products = await AIModel.recommendProducts({ material, color });
      const suggestions = buildSuggestions({ material, color, count: products.length });

      res.json({
        material: material || 'Not specified',
        color: color || 'Not specified',
        suggestions,
        productCount: products.length,
        products: products.slice(0, 10)
      });
    } catch (err) {
      console.error('AI recommend error:', err);
      res.status(500).json({ 
        error: 'AI recommendation failed',
        suggestions: []
      });
    }
  },

  async getComplementaryOptions(req, res) {
    try {
      const { material, color } = req.query;
      
      let complementaryMaterials = [];
      let complementaryColors = [];

      if (material) {
        complementaryMaterials = await AIModel.getComplementaryMaterials(material);
      }
      if (color) {
        complementaryColors = await AIModel.getComplementaryColors(color);
      }

      res.json({
        material,
        color,
        complementaryMaterials,
        complementaryColors
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get complementary options' });
    }
  }
};

module.exports = aiController;
