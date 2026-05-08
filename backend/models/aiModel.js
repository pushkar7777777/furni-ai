const pool = require('./db');

const AIModel = {
  async recommendProducts({ material, color }) {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    
    // Exact match on material
    if (material) { 
      sql += ' AND (material = ? OR LOWER(material) = ?)'; 
      params.push(material, material.toLowerCase());
    }
    
    // Flexible color matching
    if (color) { 
      sql += ' AND (color = ? OR LOWER(color) = ?)'; 
      params.push(color, color.toLowerCase());
    }
    
    // Add limit
    sql += ' LIMIT 12';
    
    const [rows] = await pool.query(sql, params);
    return rows || [];
  },

  async getComplementaryMaterials(material) {
    const complementary = {
      'Wood': ['Glass', 'Metal', 'Leather'],
      'Metal': ['Wood', 'Glass', 'Marble'],
      'Glass': ['Wood', 'Metal', 'Steel'],
      'Leather': ['Wood', 'Metal', 'Fabric'],
      'Fabric': ['Wood', 'Metal', 'Leather'],
      'Marble': ['Metal', 'Glass', 'Wood']
    };
    return complementary[material] || [];
  },

  async getComplementaryColors(color) {
    const complementary = {
      'White': ['Black', 'Gray', 'Beige'],
      'Brown': ['White', 'Beige', 'Gray'],
      'Black': ['White', 'Gray', 'Natural'],
      'Beige': ['Brown', 'Gray', 'White'],
      'Gray': ['Brown', 'Black', 'White'],
      'Natural': ['Brown', 'Beige', 'Black']
    };
    return complementary[color] || [];
  },

  async getRelatedProducts({ material, color }) {
    // Get exact matches first
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    
    if (material) {
      sql += ' AND LOWER(material) = ?';
      params.push(material.toLowerCase());
    }
    if (color) {
      sql += ' AND LOWER(color) = ?';
      params.push(color.toLowerCase());
    }
    sql += ' LIMIT 20';
    
    const [rows] = await pool.query(sql, params);
    return rows || [];
  }
};

module.exports = AIModel;
