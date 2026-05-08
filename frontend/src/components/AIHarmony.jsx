import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Loader, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { getAIRecommendation, getAIProductMatches } from '../services/api';
import gsap from 'gsap';

const AIHarmony = ({ onClose, minimal = false }) => {
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const containerRef = useRef(null);

  const materials = ['Wood', 'Metal', 'Glass', 'Leather', 'Fabric', 'Marble'];
  const colors = ['White', 'Brown', 'Black', 'Beige', 'Gray', 'Natural'];

  useEffect(() => {
    if (containerRef.current && hasSearched) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }
      );
    }
  }, [hasSearched]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!material || !color) {
      setError('Please select both material and color');
      return;
    }

    setLoading(true);
    setError('');
    setSuggestions([]);
    setProducts([]);

    try {
      // Get AI recommendations and matching products
      const recResponse = await getAIRecommendation({ material, color });
      const prodResponse = await getAIProductMatches({ material, color });

      setSuggestions(recResponse.suggestions || []);
      setProducts(prodResponse.products || []);
      setHasSearched(true);
    } catch (err) {
      setError('Failed to fetch recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMaterial('');
    setColor('');
    setSuggestions([]);
    setProducts([]);
    setHasSearched(false);
    setError('');
  };

  if (minimal) {
    // Minimal/Card version for home page
    return (
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel rounded-[60px] p-16 lg:p-24 reveal-up border-[#A67B5B]/20 bg-[#A67B5B]/5 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FFDAB9]/10 blur-[80px]" />
            
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-[1px] bg-[#A67B5B]" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-[#FFDAB9]">AI-Powered Design</span>
                <div className="w-12 h-[1px] bg-[#A67B5B]" />
              </div>
              <h2 className="text-5xl lg:text-7xl font-serif font-bold mb-8 tracking-tighter">
                Discover Your <span className="italic font-light text-[#FFDAB9]">Harmony.</span>
              </h2>
              <p className="text-white/40 mb-12 max-w-xl mx-auto font-light leading-relaxed">
                Our AI Harmony system analyzes your preferences to recommend furniture combinations that perfectly complement your space and aesthetic.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Material Selection */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-[#FFDAB9] mb-4">
                    Primary Material
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {materials.map((mat) => (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => setMaterial(mat)}
                        className={`py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 border-2 ${
                          material === mat
                            ? 'bg-[#A67B5B] text-white border-[#A67B5B] shadow-lg'
                            : 'bg-transparent text-[#FFDAB9] border-[#FFDAB9]/30 hover:border-[#FFDAB9]/60'
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-[#FFDAB9] mb-4 block">
                    Accent Color
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {colors.map((clr) => (
                      <button
                        key={clr}
                        type="button"
                        onClick={() => setColor(clr)}
                        className={`py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 border-2 ${
                          color === clr
                            ? 'bg-[#A67B5B] text-white border-[#A67B5B] shadow-lg'
                            : 'bg-transparent text-[#FFDAB9] border-[#FFDAB9]/30 hover:border-[#FFDAB9]/60'
                        }`}
                      >
                        {clr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span className="text-sm text-red-400">{error}</span>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#A67B5B] hover:bg-[#8B654A] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Harmony
                    </>
                  )}
                </button>
                {hasSearched && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm border-2 border-[#FFDAB9]/30 text-[#FFDAB9] hover:border-[#FFDAB9]/60 transition-all"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>

            {/* Results Section */}
            {hasSearched && (
              <div ref={containerRef} className="mt-16 pt-16 border-t border-white/10 space-y-12">
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle2 className="w-6 h-6 text-[#FFDAB9]" />
                      <h3 className="text-2xl font-serif font-bold">AI Insights</h3>
                    </div>
                    <div className="space-y-4">
                      {suggestions.map((sugg, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FFDAB9]/30 transition-all">
                          <p className="text-[#FFDAB9] font-light leading-relaxed">{sugg}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {products.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-[#A67B5B]" />
                        <h3 className="text-2xl font-serif font-bold">Matching Pieces</h3>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#FFDAB9]/60">
                        {products.length} Found
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.slice(0, 3).map((product, idx) => (
                        <Link
                          key={idx}
                          to={`/products/${product.id}`}
                          className="group rounded-[32px] overflow-hidden border border-white/10 hover:border-[#FFDAB9]/30 transition-all hover:shadow-2xl"
                        >
                          <div className="aspect-square bg-gradient-to-br from-[#A67B5B]/10 to-transparent flex items-center justify-center relative overflow-hidden">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="text-center p-6">
                                <Sparkles className="w-12 h-12 text-[#FFDAB9] mx-auto mb-4" />
                                <p className="text-[#FFDAB9]/60 font-light">{product.name}</p>
                              </div>
                            )}
                          </div>
                          <div className="p-6">
                            <h4 className="font-serif font-bold mb-2 group-hover:text-[#FFDAB9] transition-colors">{product.name}</h4>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#FFDAB9]/60 mb-4">
                              {product.material}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-serif font-bold text-[#A67B5B]">
                                ₹{Number(product.price).toLocaleString()}
                              </span>
                              <ArrowRight className="w-5 h-5 text-[#FFDAB9]/40 group-hover:text-[#FFDAB9] group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {products.length > 3 && (
                      <Link
                        to="/products"
                        className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-[#FFDAB9]/30 text-[#FFDAB9] hover:border-[#FFDAB9]/60 transition-all font-black uppercase tracking-widest text-sm"
                      >
                        View All Matches <ArrowRight className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                )}

                {!suggestions.length && !products.length && (
                  <div className="text-center p-8">
                    <AlertCircle className="w-12 h-12 text-[#FFDAB9]/40 mx-auto mb-4" />
                    <p className="text-[#FFDAB9]/60">No results found for this combination. Try different options.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Full modal version for standalone use
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="glass-panel rounded-[40px] p-8 lg:p-16 border-white/10 relative">
          <div className="absolute top-8 right-8">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-[#FFDAB9]/10 border border-[#FFDAB9]/30">
              <Sparkles className="w-5 h-5 text-[#FFDAB9]" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#FFDAB9]">AI Harmony System</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-4">
              Find Your Perfect <span className="text-[#FFDAB9]">Match</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Tell us your material preference and color palette. Our AI will suggest the perfect furniture combinations.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-[#FFDAB9] mb-4">
                  Material
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {materials.map((mat) => (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => setMaterial(mat)}
                      className={`py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all border-2 ${
                        material === mat
                          ? 'bg-[#A67B5B] text-white border-[#A67B5B]'
                          : 'bg-transparent text-[#FFDAB9] border-[#FFDAB9]/30 hover:border-[#FFDAB9]/60'
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] font-black text-[#FFDAB9] mb-4">
                  Color
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {colors.map((clr) => (
                    <button
                      key={clr}
                      type="button"
                      onClick={() => setColor(clr)}
                      className={`py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all border-2 ${
                        color === clr
                          ? 'bg-[#A67B5B] text-white border-[#A67B5B]'
                          : 'bg-transparent text-[#FFDAB9] border-[#FFDAB9]/30 hover:border-[#FFDAB9]/60'
                      }`}
                    >
                      {clr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-400">{error}</span>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#A67B5B] hover:bg-[#8B654A] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Find Harmony
                  </>
                )}
              </button>
              {hasSearched && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm border-2 border-[#FFDAB9]/30 text-[#FFDAB9] hover:border-[#FFDAB9]/60"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {hasSearched && (
            <div ref={containerRef} className="mt-12 pt-12 border-t border-white/10 space-y-8">
              {suggestions.length > 0 && (
                <div>
                  <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-[#FFDAB9]" />
                    Design Insights
                  </h3>
                  <div className="space-y-3">
                    {suggestions.map((sugg, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-[#FFDAB9] font-light">{sugg}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {products.length > 0 && (
                <div>
                  <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-[#A67B5B]" />
                    Recommended Products ({products.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
                    {products.map((product, idx) => (
                      <Link
                        key={idx}
                        to={`/products/${product.id}`}
                        className="p-4 rounded-xl border border-white/10 hover:border-[#FFDAB9]/30 hover:bg-white/5 transition-all group"
                      >
                        <h4 className="font-serif font-bold mb-1 group-hover:text-[#FFDAB9]">{product.name}</h4>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#FFDAB9]/60 mb-2">
                          {product.material}
                        </p>
                        <p className="text-lg font-serif font-bold text-[#A67B5B]">
                          ₹{Number(product.price).toLocaleString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!suggestions.length && !products.length && (
                <div className="text-center p-8">
                  <p className="text-[#FFDAB9]/60">No recommendations available for this combination.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIHarmony;
