import React, { memo } from "react";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import useMobile from "../utils/useMobile";

const ProductCard = memo(({ product, children, onWishlist, onQuickView, onAddCart }) => {
  const isOutOfStock = Number(product.stock) <= 0;
  const isMobile = useMobile();

  return (
    <article className={`group overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#1d120c]/40 to-[#0f0a07] transition-all duration-300 flex flex-col h-full ${
      isMobile ? 'shadow-lg' : 'shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:border-[#FFDAB9]/25'
    }`}>
      
      {/* Image Container */}
      <div className="relative h-60 bg-gradient-to-br from-[#A67B5B]/20 to-[#3f2919]/30 overflow-hidden">
        
        {/* Product Image */}
        <OptimizedImage
          src={product.image_url}
          alt={product.name}
          aspectRatio="h-full w-full"
          className="group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay on hover - disabled on mobile for performance */}
        {!isMobile && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] ${
            isOutOfStock
              ? 'bg-red-500/20 text-red-200'
              : Number(product.stock) > 20
              ? 'bg-emerald-500/20 text-emerald-200'
              : 'bg-yellow-500/20 text-yellow-200'
          }`}>
            {isOutOfStock ? 'Out' : `${product.stock} left`}
          </span>
        </div>

        {/* Discount Badge (if applicable) */}
        {product.discount && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center rounded-full bg-[#D4AF37] text-[#2E1F13] font-bold px-3 py-1.5 text-xs">
              -{product.discount}%
            </span>
          </div>
        )}

        {/* Action Buttons on Hover - simplified on mobile */}
        <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300 z-20 ${
          isMobile ? 'opacity-100 bottom-0 top-auto h-12 bg-black/40 backdrop-blur-sm' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <button
            onClick={onWishlist}
            className={`rounded-full bg-[#FFDAB9] text-[#2E1F13] hover:bg-[#D4AF37] transition-colors shadow-lg ${isMobile ? 'p-2' : 'p-3'}`}
            title="Add to Wishlist"
          >
            <Heart className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </button>
          
          <button
            onClick={onQuickView}
            className={`rounded-full bg-[#D4AF37] text-[#2E1F13] hover:bg-[#E5C158] transition-colors shadow-lg font-bold ${isMobile ? 'p-2' : 'p-3'}`}
            title="Quick View"
          >
            <Eye className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </button>
          
          <button
            onClick={onAddCart}
            disabled={isOutOfStock}
            className={`rounded-full bg-[#A67B5B] text-white hover:bg-[#8B654A] disabled:bg-white/10 disabled:text-white/40 transition-colors shadow-lg ${isMobile ? 'p-2' : 'p-3'}`}
            title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
          >
            <ShoppingCart className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-6 flex-1 flex flex-col">
        
        {/* Product Name */}
        <div>
          <h3 className={`font-serif font-bold text-[#FFF8F0] transition-colors line-clamp-2 leading-snug ${
            isMobile ? 'text-base' : 'text-lg group-hover:text-[#D4AF37]'
          }`}>
            {product.name}
          </h3>
          
          {/* Material & Color */}
          <p className="mt-1.5 text-xs text-[#FFF8F0]/50 uppercase tracking-wider">
            {product.material || 'Premium'} • {product.color || 'Neutral'}
          </p>
        </div>

        {/* Rating Section - Hidden on mobile if space is tight, or just simplified */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < 4 ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-white/20 text-white/20'}`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-[#FFF8F0]/70">(24)</span>
        </div>

        {/* Price Section */}
        <div className={`rounded-xl bg-gradient-to-r from-[#A67B5B]/20 to-[#3f2919]/20 border border-[#A67B5B]/20 ${isMobile ? 'p-2' : 'p-3'}`}>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#FFDAB9]/70 mb-1">Price</p>
          <div className="flex items-center gap-2">
            <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-[#FFF8F0]`}>
              ₹{Number(product.price).toLocaleString('en-IN')}
            </p>
            {product.originalPrice && (
              <p className="text-xs line-through text-[#FFF8F0]/40">
                ₹{Number(product.originalPrice).toLocaleString('en-IN')}
              </p>
            )}
          </div>
        </div>

        {/* Delivery Info - Hidden on mobile to save space */}
        {!isMobile && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
            <p className="text-xs text-emerald-200">✓ 3-5 days • Free shipping</p>
          </div>
        )}

        {/* Custom Actions */}
        {children && <div className="mt-auto">{children}</div>}

        {/* Add to Cart Button - Simplified on mobile */}
        {!children && !isMobile && (
          <button
            onClick={onAddCart}
            disabled={isOutOfStock}
            className="w-full rounded-2xl bg-gradient-to-r from-[#A67B5B] to-[#8B5E3C] px-4 py-3 text-sm font-bold text-white transition hover:from-[#8B654A] hover:to-[#6B4423] disabled:from-white/10 disabled:to-white/10 disabled:text-white/40 flex items-center justify-center gap-2 mt-auto"
          >
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
