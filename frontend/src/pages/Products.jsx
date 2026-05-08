import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { 
  Search, 
  ChevronDown, 
  LayoutGrid, 
  List, 
  ShoppingBag,
  SlidersHorizontal,
  X,
  Plus,
  Zap,
  RefreshCw,
  Sparkles,
  Check
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProducts, getAIRecommendation, addToWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import useMobile from '../utils/useMobile';
import Footer from '../components/Footer';
import AIHarmony from '../components/AIHarmony';
import gsap from 'gsap';

// ─── Debounce Hook ──────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const ITEMS_PER_PAGE = 8;

const Products = () => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);

  // AI Harmony State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [harmonyMode, setHarmonyMode] = useState(false);
  const [showAIHarmony, setShowAIHarmony] = useState(false);

  // Filter States from URL
  const filters = {
    search: searchParams.get("search") || "",
    material: searchParams.get("material") || "",
    color: searchParams.get("color") || "",
    sort: searchParams.get("sort") || "newest"
  };

  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        addToast({ variant: "error", message: "Failed to load masterpieces." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const materials = useMemo(() => [...new Set(products.map(p => p.material).filter(Boolean))], [products]);
  const colors = useMemo(() => [...new Set(products.map(p => p.color).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (debouncedSearch) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (filters.material) {
      result = result.filter(p => (p.material || '').toLowerCase() === filters.material.toLowerCase());
    }

    if (filters.color) {
      result = result.filter(p => (p.color || '').toLowerCase() === filters.color.toLowerCase());
    }

    switch (filters.sort) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'popular': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, debouncedSearch, filters.material, filters.color, filters.sort]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleItems);
  }, [filteredProducts, visibleItems]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
    setVisibleItems(ITEMS_PER_PAGE);
  };

  const checkHarmony = async () => {
    if (!filters.material || !filters.color) {
      addToast({ variant: "info", message: "Select a Material and Color to check harmony." });
      return;
    }

    try {
      setAiLoading(true);
      setHarmonyMode(true);
      const data = await getAIRecommendation({ material: filters.material, color: filters.color });
      setAiSuggestions(data.suggestions || []);
      
      setTimeout(() => {
        gsap.fromTo(".suggestion-tag", 
          { y: 20, opacity: 0, scale: 0.8 }, 
          { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" }
        );
      }, 100);

    } catch {
      addToast({ variant: "error", message: "AI Oracle is currently offline." });
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    const currentUserId = localStorage.getItem("user_id");
    if (!currentUserId) {
      addToast({ variant: "info", message: "Please log in to add items to cart." });
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, 1);
      addToast({ variant: "success", message: `${product.name} added to cart!` });
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.error || "Failed to add to cart." });
    }
  };

  const handleAddToWishlist = async (product) => {
    const currentUserId = localStorage.getItem("user_id");
    if (!currentUserId) {
      addToast({ variant: "info", message: "Please log in to add to wishlist." });
      navigate('/login');
      return;
    }
    try {
      await addToWishlist({ product_id: product.id });
      addToast({ variant: "success", message: `${product.name} added to wishlist!` });
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.error || "Failed to add to wishlist." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2E1F13] pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
           <Skeleton className="h-12 w-64 mb-8 rounded-xl" />
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/5] rounded-[40px]" />
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-1/2 rounded-lg" />
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-[#A67B5B] selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-[1px] bg-[#A67B5B]" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#FFDAB9]">Curated Selection</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-[#FFF8F0] tracking-tighter leading-none">
              Saikamal <span className="italic font-light text-[#FFDAB9]">Gallery.</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:min-w-[400px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFF8F0]/30" />
              <input 
                type="text" 
                placeholder="Search masterpieces..." 
                value={filters.search}
                onChange={(e) => updateParam("search", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm text-[#FFF8F0] placeholder-[#FFF8F0]/20 focus:outline-none focus:border-[#A67B5B]/50 transition-all"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-3 px-8 py-5 rounded-2xl border transition-all ${
                showFilters ? 'bg-[#A67B5B] border-[#A67B5B] text-white' : 'bg-white/5 border-white/10 text-[#FFF8F0] hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-[10px] uppercase font-black tracking-widest">Refine</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-[800px] mb-12 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="glass-panel p-8 lg:p-12 rounded-[40px] border-white/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
            <button onClick={() => setShowFilters(false)} className="absolute top-8 right-8 p-2 text-white/20 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#FFDAB9]">Material</p>
              <select 
                value={filters.material}
                onChange={(e) => updateParam("material", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-[#FFF8F0] focus:outline-none"
              >
                <option value="">All Materials</option>
                {materials.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#FFDAB9]">Color Aesthetic</p>
              <select 
                value={filters.color}
                onChange={(e) => updateParam("color", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-[#FFF8F0] focus:outline-none"
              >
                <option value="">All Colors</option>
                {colors.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#FFDAB9]">Sort Order</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'newest', label: 'Newest' },
                  { id: 'popular', label: 'Popular' },
                  { id: 'price-low', label: 'Price Low' },
                  { id: 'price-high', label: 'Price High' }
                ].map(sort => (
                  <button
                    key={sort.id}
                    onClick={() => updateParam("sort", sort.id)}
                    className={`px-3 py-3 rounded-xl text-[9px] uppercase font-black tracking-widest transition-all text-center ${
                      filters.sort === sort.id ? 'bg-[#FFF8F0] text-[#2E1F13]' : 'bg-white/5 text-[#FFF8F0]/40 hover:bg-white/10'
                    }`}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end pb-1">
              <button 
                onClick={() => setSearchParams({})}
                className="w-full py-4 rounded-xl border border-[#A67B5B]/30 text-[#A67B5B] text-[10px] uppercase font-black tracking-widest hover:bg-[#A67B5B] hover:text-white transition-all"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>

        {/* AI Harmony Checker Section */}
        <div className="mb-12 overflow-hidden rounded-[2.5rem] border border-[#A67B5B]/30 bg-gradient-to-br from-[#A67B5B]/10 to-transparent p-8 backdrop-blur-xl relative group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFDAB9]/5 blur-3xl rounded-full pointer-events-none group-hover:bg-[#FFDAB9]/10 transition-all duration-700" />
           <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[2rem] bg-[#A67B5B] flex items-center justify-center text-white shadow-2xl shadow-[#A67B5B]/40">
                    <Zap className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="font-serif text-2xl font-bold text-[#FFF8F0] mb-1">AI <span className="italic font-light text-[#FFDAB9]">Harmony.</span></h3>
                    <p className="text-[#FFF8F0]/40 text-xs max-w-md font-light">Select material & color above to check synergy.</p>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                 {harmonyMode && aiSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
                       {aiSuggestions.map((s, i) => (
                          <div key={i} className="suggestion-tag flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#FFDAB9] shadow-xl">
                             <Check className="w-3 h-3 text-emerald-400" />
                             {s}
                          </div>
                       ))}
                    </div>
                 )}
                 
                 <button 
                    onClick={checkHarmony}
                    disabled={aiLoading}
                    className="bg-[#FFF8F0] text-[#2E1F13] px-10 py-4 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                 >
                    {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {aiLoading ? 'Synthesizing...' : 'Check Synergy'}
                 </button>

                 <button 
                    onClick={() => setShowAIHarmony(true)}
                    className="hidden md:flex bg-[#A67B5B]/80 hover:bg-[#A67B5B] text-white px-10 py-4 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-[1.05] active:scale-95 transition-all items-center gap-3 border border-[#FFDAB9]/20"
                 >
                    <Sparkles className="w-4 h-4" />
                    Explorer
                 </button>
              </div>
           </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-8 px-2">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#FFF8F0]/30">
            Displaying <span className="text-[#FFDAB9]">{displayedProducts.length}</span> of <span className="text-[#FFF8F0]">{filteredProducts.length}</span> Pieces
          </p>
          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/5">
             <button 
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#A67B5B] text-white shadow-lg' : 'text-[#FFF8F0]/20 hover:text-white'}`}
             >
                <LayoutGrid className="w-4 h-4" />
             </button>
             <button 
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#A67B5B] text-white shadow-lg' : 'text-[#FFF8F0]/20 hover:text-white'}`}
             >
                <List className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Product Grid */}
        {displayedProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10" 
            : "flex flex-col gap-8"
          }>
            {displayedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                viewMode={viewMode}
                onAddCart={() => handleAddToCart(product)}
                onWishlist={() => handleAddToWishlist(product)}
                onQuickView={() => navigate(`/products/${product.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center glass-panel rounded-[40px] border-white/5 border-dashed border-2">
            <div className="w-20 h-20 bg-white/2 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
               <ShoppingBag className="w-8 h-8 text-white/10" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#FFF8F0] mb-3">No matching pieces found</h3>
            <p className="text-[#FFF8F0]/30 text-sm font-light mb-8">Try adjusting your filters or search keywords.</p>
            <button 
              onClick={() => setSearchParams({})}
              className="px-10 py-4 bg-[#A67B5B] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Load More Section */}
        {visibleItems < filteredProducts.length && (
          <div className="mt-20 text-center">
            <button 
              onClick={() => setVisibleItems(prev => prev + ITEMS_PER_PAGE)}
              className="group relative inline-flex items-center gap-4 bg-white/5 border border-white/10 text-[#FFF8F0] px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#A67B5B] hover:border-[#A67B5B] transition-all"
            >
              <Plus className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Discover More
            </button>
            <p className="mt-6 text-[10px] uppercase tracking-[0.3em] font-black text-[#FFF8F0]/20 italic">Showing {displayedProducts.length} of {filteredProducts.length}</p>
          </div>
        )}
      </div>

      <Footer />
      {showAIHarmony && <AIHarmony onClose={() => setShowAIHarmony(false)} minimal={false} />}

      <style>{`
        .glass-panel {
          background: rgba(46, 31, 19, 0.4);
          backdrop-filter: blur(24px);
        }
        select option {
          background: #2E1F13;
          color: #FFF8F0;
        }
      `}</style>
    </div>
  );
};

export default Products;
