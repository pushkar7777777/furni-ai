const API_ORIGIN = 'http://localhost:5000';

const exactProductImages = {
  'modern gray sectional sofa': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop',
  'luxury black leather sofa': 'https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?q=80&w=1000&auto=format&fit=crop',
  'classic brown couch': 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1000&auto=format&fit=crop',
  'minimal white settee': 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=80&w=1000&auto=format&fit=crop',
  'platform bed - modern gray': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000&auto=format&fit=crop',
  'luxury gold bed frame': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1000&auto=format&fit=crop',
  'classic wooden bed': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000&auto=format&fit=crop',
  'minimal platform white': 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=1000&auto=format&fit=crop',
  'accent chair - modern black': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1000&auto=format&fit=crop',
  'luxury velvet chair': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop',
  'classic wooden chair': 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1000&auto=format&fit=crop',
  'minimal eames chair': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop',
  'glass coffee table - modern': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop',
  'luxury marble dining table': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1000&auto=format&fit=crop',
  'classic wood dining table': 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=1000&auto=format&fit=crop',
  'minimal side table': 'https://images.unsplash.com/photo-1499933374294-4584851497cc?q=80&w=1000&auto=format&fit=crop',
  'modern wardrobe - matte black': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1000&auto=format&fit=crop',
  'luxury gold wardrobe': 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1000&auto=format&fit=crop',
  'classic brown wardrobe': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop',
  'minimal white wardrobe': 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1000&auto=format&fit=crop',
  'gaming desk - modern': 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop',
  'executive desk - luxury': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1000&auto=format&fit=crop',
  'study table - classic': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000&auto=format&fit=crop',
  'work desk - minimal': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000&auto=format&fit=crop',
  'pendant lamp - modern': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop',
  'crystal chandelier - luxury': 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?q=80&w=1000&auto=format&fit=crop',
  'table lamp - classic': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1000&auto=format&fit=crop',
  'minimalist floor lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop',
  'modern geometric rug': 'https://images.unsplash.com/photo-1594040226829-7f251ab46d80?q=80&w=1000&auto=format&fit=crop',
  'luxury persian rug': 'https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=1000&auto=format&fit=crop',
  'classic oriental rug': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop',
  'minimal plain rug': 'https://images.unsplash.com/photo-1594040226829-7f251ab46d80?q=80&w=1000&auto=format&fit=crop',
  'modern wall art - abstract': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
  'luxury gold mirror': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop',
  'classic photo frame set': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
  'minimal plant pot': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1000&auto=format&fit=crop',
};

const categoryImages = {
  sofa: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop',
  bed: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000&auto=format&fit=crop',
  chair: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1000&auto=format&fit=crop',
  table: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop',
  wardrobe: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1000&auto=format&fit=crop',
  desk: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000&auto=format&fit=crop',
  lamp: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop',
  rug: 'https://images.unsplash.com/photo-1594040226829-7f251ab46d80?q=80&w=1000&auto=format&fit=crop',
  decoration: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
  other: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1000&auto=format&fit=crop',
};

const productTypeImages = [
  {
    keywords: ['tv stand', 'tv unit', 'tv console', 'television stand', 'media console', 'entertainment unit'],
    image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['bookshelf', 'book shelf', 'bookcase', 'book rack'],
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['shoe rack', 'shoe cabinet', 'shoe storage'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['coffee table', 'center table', 'centre table'],
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['dining table', 'dinner table'],
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['side table', 'end table', 'nightstand', 'bedside table'],
    image: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['office chair', 'ergonomic chair', 'computer chair'],
    image: 'https://images.unsplash.com/photo-1505797149-35ebcb05a716?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['dining chair'],
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['recliner', 'lounge chair', 'lounger'],
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['rocking chair'],
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['sofa bed', 'futon'],
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['sectional sofa', 'sectional'],
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['leather sofa'],
    image: 'https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['queen bed', 'king bed', 'single bed', 'double bed', 'platform bed', 'bed frame'],
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['bunk bed'],
    image: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['study table', 'study desk', 'work desk', 'computer desk', 'gaming desk'],
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['wardrobe', 'almirah', 'closet'],
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['chest of drawers', 'drawer chest', 'dresser'],
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['cabinet', 'sideboard', 'storage unit', 'storage cabinet'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['floor lamp'],
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['table lamp', 'desk lamp'],
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['chandelier', 'pendant lamp', 'hanging light'],
    image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['mirror'],
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['plant pot', 'planter'],
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1000&auto=format&fit=crop',
  },
  {
    keywords: ['wall art', 'painting', 'photo frame', 'frame set'],
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
  },
];

const isUsableImageUrl = (imageUrl = '') => {
  return imageUrl && !imageUrl.includes('placeholder.com') && !imageUrl.startsWith('/products/');
};

const normalizeImageUrl = (imageUrl = '') => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http') || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) return imageUrl;
  return `${API_ORIGIN}${imageUrl}`;
};

export const getProductImage = (product = {}) => {
  if (isUsableImageUrl(product.image_url)) return normalizeImageUrl(product.image_url);

  const name = String(product.name || '').trim().toLowerCase();
  const category = String(product.furniture_category || '').trim().toLowerCase();

  if (exactProductImages[name]) return exactProductImages[name];
  const productTypeMatch = productTypeImages.find(({ keywords }) => keywords.some((keyword) => name.includes(keyword)));
  if (productTypeMatch) return productTypeMatch.image;

  if (name.includes('sofa') || name.includes('couch') || name.includes('sectional') || name.includes('settee')) return categoryImages.sofa;
  if (name.includes('bed')) return categoryImages.bed;
  if (name.includes('chair')) return categoryImages.chair;
  if (name.includes('table')) return categoryImages.table;
  if (name.includes('wardrobe')) return categoryImages.wardrobe;
  if (name.includes('desk')) return categoryImages.desk;
  if (name.includes('lamp') || name.includes('light') || name.includes('chandelier')) return categoryImages.lamp;
  if (name.includes('rug') || name.includes('carpet')) return categoryImages.rug;
  if (name.includes('decor') || name.includes('mirror') || name.includes('frame') || name.includes('art') || name.includes('pot')) return categoryImages.decoration;
  if (categoryImages[category]) return categoryImages[category];

  return categoryImages.other;
};

const galleryImagesByType = [
  {
    keywords: ['tv stand', 'tv unit', 'tv console', 'television stand', 'media console', 'entertainment unit'],
    images: [
      'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615874694520-474822394e73?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602872030490-4a484a7b3ba6?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    keywords: ['bookshelf', 'book shelf', 'bookcase', 'book rack'],
    images: [
      'https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    keywords: ['shoe rack', 'shoe cabinet', 'shoe storage'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    keywords: ['coffee table', 'center table', 'centre table'],
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    keywords: ['dining table', 'dinner table'],
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    keywords: ['wardrobe', 'almirah', 'closet', 'cabinet', 'sideboard', 'storage unit', 'storage cabinet', 'dresser'],
    images: [
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    keywords: ['sofa', 'couch', 'sectional', 'settee'],
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    keywords: ['chair', 'recliner', 'lounger'],
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    keywords: ['bed'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    keywords: ['desk', 'study table', 'work table'],
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop',
    ],
  },
];

export const getProductGalleryImages = (product = {}) => {
  const name = String(product.name || '').trim().toLowerCase();
  const baseImage = getProductImage(product);
  const matchedGallery = galleryImagesByType.find(({ keywords }) => keywords.some((keyword) => name.includes(keyword)));
  const gallery = matchedGallery?.images || [
    baseImage,
    categoryImages[String(product.furniture_category || '').trim().toLowerCase()] || categoryImages.other,
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop',
  ];

  return [...new Set([baseImage, ...gallery])].slice(0, 4);
};
