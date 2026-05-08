import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Star } from 'lucide-react';

const FeaturedSection = ({ products = [] }) => {
  if (!products || products.length === 0) {
    return null;
  }

  // Get top 6 products by stock or random selection
  const featuredProducts = products
    .sort((a, b) => Number(b.stock) - Number(a.stock))
    .slice(0, 6);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40">
              <Flame className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FFF8F0]">
                🔥 Trending Now
              </h2>
              <p className="text-[#FFF8F0]/60 text-sm">Most popular furniture this season</p>
            </div>
          </div>
          
          <Link
            to="/products"
            className="text-[#D4AF37] font-semibold text-sm hover:text-[#FFDAB9] transition-colors flex items-center gap-1"
          >
            View All →
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group overflow-hidden rounded-[2rem] border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300"
            >
              <div className="relative h-80 bg-gradient-to-br from-[#A67B5B]/20 to-[#3f2919]/30 overflow-hidden">
                {/* Image */}
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#A67B5B]/30 to-transparent">
                    <div className="text-center">
                      <div className="text-5xl mb-2">🪑</div>
                      <p className="text-[#FFF8F0]/50 text-sm">No image</p>
                    </div>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Best Seller Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center gap-1 rounded-full bg-[#D4AF37] px-3 py-1.5 text-xs font-bold text-[#2E1F13]">
                    <Flame className="w-3 h-3" />
                    Best Seller
                  </div>
                </div>

                {/* Stock Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] ${
                    Number(product.stock) > 20
                      ? 'bg-emerald-500/20 text-emerald-200'
                      : Number(product.stock) > 0
                      ? 'bg-yellow-500/20 text-yellow-200'
                      : 'bg-red-500/20 text-red-200'
                  }`}>
                    {Number(product.stock) > 0 ? `${product.stock} left` : 'Out'}
                  </span>
                </div>

                {/* Quick View Button */}
                <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pb-6">
                  <button className="rounded-full bg-[#D4AF37] text-[#2E1F13] font-semibold px-6 py-2.5 hover:bg-[#E5C158] transition-colors text-sm">
                    Quick View
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 bg-gradient-to-b from-[#1d120c]/60 to-[#0f0a07]">
                <h3 className="font-serif text-lg font-bold text-[#FFF8F0] group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                  {product.name}
                </h3>

                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#FFF8F0]/50 uppercase tracking-wider">
                      {product.material || 'Premium'} • {product.color || 'Neutral'}
                    </p>
                    <p className="mt-1 text-[#D4AF37] font-bold text-xl">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    <span className="text-xs font-semibold text-[#FFF8F0]">4.8</span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mt-4 rounded-lg bg-[#A67B5B]/10 border border-[#A67B5B]/20 px-3 py-2">
                  <p className="text-xs text-[#FFDAB9]">✓ Delivery in 3-5 days</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
