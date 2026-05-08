import React, { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { addReview, addToWishlist, deleteReview, getAIProductMatches, getProductById, updateReview } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Heart, ShoppingCart, Truck, RotateCcw, Shield, Star, Edit2, Trash2, Check, X, LoaderCircle, Sparkles } from 'lucide-react';
import Footer from '../components/Footer';
import { getProductGalleryImages, getProductImage } from '../utils/productImages';
import OptimizedImage from '../components/OptimizedImage';
import Skeleton from '../components/Skeleton';
import useMobile from '../utils/useMobile';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState({ rating: '', comment: '' });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToast } = useToast();
  const { addToCart } = useCart();
  const currentUserId = Number(localStorage.getItem("user_id"));
  const currentUserName = localStorage.getItem("user_name") || "Customer";

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct({ ...data, reviews: data.reviews || [] });
      setSelectedImageIndex(0);
      setError(null);
      const viewed = JSON.parse(localStorage.getItem("recently_viewed_products") || "[]");
      const nextViewed = [Number(id), ...viewed.filter((item) => item !== Number(id))].slice(0, 8);
      localStorage.setItem("recently_viewed_products", JSON.stringify(nextViewed));
    } catch {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    // Scroll to top on ID change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const myReview = useMemo(
    () => (product?.reviews || []).find((item) => Number(item.user_id) === currentUserId),
    [product, currentUserId]
  );

  useEffect(() => {
    if (myReview && !editingReviewId) {
      setReview({ rating: String(myReview.rating), comment: myReview.comment || '' });
    }
  }, [myReview, editingReviewId]);

  const averageRating = useMemo(() => {
    if (!product?.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + Number(review.rating), 0);
    return (sum / product.reviews.length).toFixed(1);
  }, [product]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      addToast({ variant: "info", message: "Please log in to add a review." });
      navigate('/login');
      return;
    }
    try {
      const reviewToUpdate = editingReviewId || myReview?.id;
      if (reviewToUpdate) {
        await updateReview(reviewToUpdate, review);
        addToast({ variant: "success", message: "Review updated successfully." });
      } else {
        await addReview({ product_id: id, ...review, reviewer_name: currentUserName });
        addToast({ variant: "success", message: "Review added successfully." });
      }
      setReview({ rating: '', comment: '' });
      setEditingReviewId(null);
      await loadProduct();
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.error || "Failed to save review." });
    }
  };

  const handleEditReview = (item) => {
    setEditingReviewId(item.id);
    setReview({ rating: String(item.rating), comment: item.comment });
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      addToast({ variant: "success", message: "Review deleted successfully." });
      await loadProduct();
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.error || "Failed to delete review." });
    }
  };

  const handleAISuggestions = async () => {
    try {
      const data = await getAIProductMatches({ material: product.material, color: product.color });
      setAiSuggestions(data.filter((item) => item.id !== product.id).slice(0, 4).map((item) => ({ ...item, image_url: getProductImage(item) })));
    } catch {
      addToast({ variant: "error", message: "AI suggestion failed." });
    }
  };

  const handleAddToCart = async () => {
    if (!currentUserId) {
      addToast({ variant: "info", message: "Please log in to add items to cart." });
      navigate('/login');
      return;
    }
    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      addToast({ variant: "success", message: "Added to cart successfully!" });
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.error || "Failed to add to cart." });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!currentUserId) {
      addToast({ variant: "info", message: "Please log in to add to wishlist." });
      navigate('/login');
      return;
    }
    try {
      await addToWishlist({ product_id: product.id });
      setIsWishlisted(true);
      addToast({ variant: "success", message: "Added to wishlist!" });
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.error || "Failed to add to wishlist." });
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#2E1F13]">
        <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-2">
           <Skeleton className="aspect-square rounded-[2rem] lg:rounded-[4rem]" />
           <div className="space-y-8">
              <Skeleton className="h-12 w-3/4 rounded-xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <div className="grid grid-cols-2 gap-4">
                 <Skeleton className="h-16 rounded-2xl" />
                 <Skeleton className="h-16 rounded-2xl" />
              </div>
              <Skeleton className="h-64 w-full rounded-3xl" />
           </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">{error}</p>
          <Link to="/products" className="inline-flex items-center gap-2 rounded-2xl bg-[#A67B5B] px-6 py-3 text-white hover:bg-[#8B654A] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isOutOfStock = Number(product.stock) <= 0;
  const galleryImages = getProductGalleryImages(product);
  const selectedImage = galleryImages[selectedImageIndex] || getProductImage(product);

  return (
    <div className="selection:bg-[#A67B5B] selection:text-white">
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumb */}
          <Link to="/products" className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#FFDAB9] transition-colors mb-8 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          {/* Product Container */}
          <div className="grid gap-12 lg:grid-cols-2">
            
            {/* Left: Image Gallery */}
            <div className="space-y-4 lg:sticky lg:top-32 h-fit">
              <div className="rounded-[2rem] lg:rounded-[4rem] border border-white/10 overflow-hidden bg-white/2 aspect-square flex items-center justify-center shadow-3xl">
                {selectedImage ? (
                  <OptimizedImage
                    src={selectedImage}
                    alt={`${product.name} view ${selectedImageIndex + 1}`}
                    aspectRatio="h-full w-full"
                    className="w-full h-full"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🪑</div>
                    <p className="text-[#FFF8F0]/50">No image available</p>
                  </div>
                )}
              </div>

              {/* Additional Angles */}
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`rounded-2xl border overflow-hidden h-20 lg:h-24 transition-all ${selectedImageIndex === idx ? 'border-[#D4AF37] scale-105 shadow-xl shadow-[#D4AF37]/10' : 'border-white/10 hover:border-[#D4AF37]/40'}`}
                    aria-label={`Show ${product.name} view ${idx + 1}`}
                  >
                    <OptimizedImage 
                      src={img} 
                      alt={`${product.name} angle ${idx + 1}`} 
                      aspectRatio="h-full w-full"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="space-y-8 lg:pt-4">
              
              {/* Header */}
              <div className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-[1px] bg-[#A67B5B]" />
                      <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#FFDAB9]">
                        {product.material || 'Premium'} Artifact
                      </span>
                    </div>
                    <h1 className="font-serif text-5xl lg:text-7xl font-bold text-[#FFF8F0] tracking-tighter leading-none mb-4">
                      {product.name}
                    </h1>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <span className={`inline-flex items-center rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap shadow-xl ${
                      isOutOfStock
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : Number(product.stock) > 50
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {isOutOfStock ? '❌ Archival / Out of Stock' : `✓ ${product.stock} pieces available`}
                    </span>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.round(averageRating) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-white/10 text-white/10'}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-[#FFF8F0]/50 tracking-widest">{averageRating} ({product.reviews?.length || 0})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="glass-panel p-8 lg:p-10 rounded-[32px] lg:rounded-[48px] border-white/5 space-y-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#A67B5B]/10 blur-[60px] group-hover:bg-[#A67B5B]/20 transition-all" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-[#FFDAB9]/40">Investment Value</p>
                <div className="flex items-baseline gap-4">
                  <p className="text-5xl lg:text-6xl font-serif font-bold text-[#FFF8F0] tracking-tighter">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </p>
                  {product.originalPrice && (
                    <p className="text-xl line-through text-[#FFF8F0]/20 font-light italic">
                      ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> Includes White-Glove Installation
                </p>
              </div>

              {/* Quantity & CTA */}
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFF8F0]/30">Quantity</span>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1">
                     <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-12 h-12 flex items-center justify-center text-xl text-[#FFF8F0]/40 hover:text-white transition-colors"
                     >-</button>
                     <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
                      className="w-16 bg-transparent text-center font-bold text-[#FFF8F0] focus:outline-none"
                     />
                     <button 
                      onClick={() => setQuantity(q => Math.min(Number(product.stock), q + 1))}
                      className="w-12 h-12 flex items-center justify-center text-xl text-[#FFF8F0]/40 hover:text-white transition-colors"
                     >+</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || addingToCart}
                    className="group relative flex items-center justify-center gap-4 bg-[#A67B5B] text-white px-10 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#8B654A] transition-all shadow-3xl disabled:opacity-50 active:scale-95 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    {addingToCart ? (
                      <LoaderCircle className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        {isOutOfStock ? 'Out of Stock' : 'Acquire Piece'}
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleAddToWishlist}
                    className="flex items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-10 py-6 font-black uppercase tracking-[0.2em] text-xs text-[#FFF8F0] transition-all hover:bg-white/10 active:scale-95"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#FFDAB9] text-[#FFDAB9]' : ''}`} />
                    Wishlist
                  </button>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                {[
                  { icon: Truck, title: 'White Glove', desc: 'Expert delivery' },
                  { icon: RotateCcw, title: '30-Day Returns', desc: 'Secure exchange' },
                  { icon: Shield, title: '2-Year Warranty', desc: 'Premium fidelity' },
                  { icon: Check, title: 'Certified', desc: 'Authentic timber' }
                ].map((s, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                     <s.icon className="w-5 h-5 text-[#FFDAB9] shrink-0" />
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#FFF8F0] mb-0.5">{s.title}</p>
                        <p className="text-[9px] text-[#FFF8F0]/30 font-bold uppercase tracking-widest">{s.desc}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-24">
            <div className="flex gap-10 border-b border-white/5 mb-10 overflow-x-auto pb-1">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-5 px-1 text-[10px] font-black uppercase tracking-[0.4em] transition-all whitespace-nowrap border-b-2 ${
                    activeTab === tab
                      ? 'border-[#FFDAB9] text-[#FFDAB9]'
                      : 'border-transparent text-[#FFF8F0]/20 hover:text-[#FFF8F0]/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="reveal-up">
              {activeTab === 'description' && (
                <div className="max-w-3xl space-y-8">
                  <p className="text-xl lg:text-2xl font-serif text-[#FFF8F0]/80 leading-relaxed italic">
                    "Every curve and texture of the {product.name} has been meticulously orchestrated to deliver an unparalleled sensory experience, blending the warmth of heritage timber with a contemporary architectural silhouette."
                  </p>
                  <div className="grid gap-6">
                    {[
                      'Master-crafted from select architectural grade timber',
                      'Hand-finished with botanical oils for a silk-touch surface',
                      'Ergonomically engineered for prolonged postural comfort',
                      'Reinforced joinery for generational durability',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="w-2 h-2 rounded-full bg-[#A67B5B] group-hover:scale-150 transition-transform" />
                        <span className="text-sm font-light text-[#FFF8F0]/60 tracking-wide">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid sm:grid-cols-2 gap-12 max-w-4xl">
                  {[
                    { l: 'Structure', v: product.material || 'Solid Teak / Walnut' },
                    { l: 'Aesthetic', v: product.color || 'Artisan Signature' },
                    { l: 'Fidelity', v: '2 Years Manufacturer Warranty' },
                    { l: 'Maintenance', v: 'Botanical wax only, avoid moisture' },
                    { l: 'Origin', v: 'Saikamal Heritage Atelier' },
                    { l: 'Impact', v: '100% Regenerative Sourcing' }
                  ].map((s, i) => (
                    <div key={i} className="space-y-2 border-l border-white/5 pl-6">
                      <p className="text-[9px] uppercase tracking-[0.4em] font-black text-[#FFDAB9]/40">{s.l}</p>
                      <p className="text-lg font-serif text-[#FFF8F0]">{s.v}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="grid lg:grid-cols-3 gap-16">
                  <div className="lg:col-span-2 space-y-8">
                     {product.reviews?.length ? (
                       <div className="grid gap-6">
                         {product.reviews.map((item) => (
                           <div key={item.id} className="glass-panel p-8 rounded-[32px] border-white/5 space-y-4">
                             <div className="flex justify-between items-start">
                                <div>
                                   <p className="font-bold text-[#FFF8F0] tracking-tight text-lg">{item.reviewer_name || "Customer"}</p>
                                   <div className="flex gap-1 mt-2">
                                     {[...Array(5)].map((_, i) => (
                                       <Star key={i} className={`w-3 h-3 ${i < Number(item.rating) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-white/10 text-white/10'}`} />
                                     ))}
                                   </div>
                                </div>
                                <span className="text-[10px] font-black text-[#FFF8F0]/20 uppercase tracking-widest">{new Date(item.created_at).toLocaleDateString()}</span>
                             </div>
                             <p className="text-[#FFF8F0]/60 font-light leading-relaxed italic">"{item.comment}"</p>
                             {Number(item.user_id) === currentUserId && (
                               <div className="flex gap-4 pt-2">
                                 <button onClick={() => handleEditReview(item)} className="text-[10px] font-black text-[#FFDAB9] uppercase tracking-widest hover:underline">Edit</button>
                                 <button onClick={() => handleDeleteReview(item.id)} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:underline">Delete</button>
                               </div>
                             )}
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[32px]">
                          <p className="text-[#FFF8F0]/20 text-sm font-black uppercase tracking-widest">No Journals Recorded Yet</p>
                       </div>
                     )}
                  </div>

                  <div className="space-y-8">
                     <div className="glass-panel p-8 lg:p-10 rounded-[32px] border-[#A67B5B]/20 bg-[#A67B5B]/5">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FFDAB9] mb-6">Leave a Journal</p>
                        <form onSubmit={handleReview} className="space-y-6">
                          <select
                            value={review.rating}
                            onChange={(e) => setReview({ ...review, rating: e.target.value })}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs text-[#FFF8F0] focus:outline-none"
                          >
                            <option value="" className="bg-[#2E1F13]">Select Rating</option>
                            {[5,4,3,2,1].map(n => <option key={n} value={n} className="bg-[#2E1F13]">{n} Stars - {n === 5 ? 'Masterpiece' : n === 1 ? 'Poor' : 'Excellent'}</option>)}
                          </select>
                          <textarea
                            value={review.comment}
                            onChange={(e) => setReview({ ...review, comment: e.target.value })}
                            required
                            placeholder="Share your thoughts on the craftsmanship..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs text-[#FFF8F0] focus:outline-none min-h-[150px] resize-none"
                          />
                          <button type="submit" className="w-full bg-[#FFF8F0] text-[#2E1F13] py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FFDAB9] transition-all active:scale-95 shadow-xl">
                            {editingReviewId ? 'Update Journal' : 'Post Journal'}
                          </button>
                        </form>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="mt-32 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-[1px] bg-[#A67B5B]" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#FFDAB9]">Curated Pairings</span>
                </div>
                <h2 className="text-4xl lg:text-6xl font-serif font-bold tracking-tighter">You Might Also <span className="italic font-light text-[#FFDAB9]">Cherish.</span></h2>
              </div>
              <button
                onClick={handleAISuggestions}
                className="group flex items-center gap-3 text-[10px] font-black text-[#FFDAB9] uppercase tracking-widest hover:text-white transition-colors"
              >
                <Sparkles className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                Refresh AI Curation
              </button>
            </div>

            {aiSuggestions.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
                {aiSuggestions.map((suggestion) => (
                  <Link
                    key={suggestion.id}
                    to={`/products/${suggestion.id}`}
                    className="group space-y-4"
                  >
                    <div className="aspect-[3/4] rounded-[40px] overflow-hidden border border-white/5 relative bg-white/2">
                      <OptimizedImage
                        src={getProductImage(suggestion)}
                        alt={suggestion.name}
                        aspectRatio="h-full w-full"
                        className="group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    </div>
                    <div className="px-4">
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#FFDAB9]/40 mb-1">{suggestion.material}</p>
                      <h3 className="font-serif text-lg lg:text-xl font-bold group-hover:text-[#FFDAB9] transition-colors line-clamp-1">{suggestion.name}</h3>
                      <p className="text-sm font-bold text-[#A67B5B] mt-2">₹{Number(suggestion.price).toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <button
                onClick={handleAISuggestions}
                className="w-full rounded-[40px] border-2 border-dashed border-white/5 bg-white/[0.01] px-10 py-20 text-center hover:bg-white/[0.03] hover:border-[#A67B5B]/30 transition-all group"
              >
                <div className="w-20 h-20 bg-[#A67B5B]/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                   <Sparkles className="w-8 h-8 text-[#FFDAB9]" />
                </div>
                <p className="text-[#FFF8F0]/20 text-xs font-black uppercase tracking-[0.5em]">Orchestrate Recommendations</p>
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .glass-panel {
          background: rgba(46, 31, 19, 0.4);
          backdrop-filter: blur(32px);
        }
        .shadow-3xl {
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;
