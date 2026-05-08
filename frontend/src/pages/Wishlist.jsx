import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { getWishlist, removeWishlistItem } from "../services/api";
import { useToast } from "../context/ToastContext";
import { useCart } from "../context/CartContext";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const { addToCart } = useCart();

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist();
      setWishlist(data);
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.error || "Failed to load wishlist." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      const payload = await removeWishlistItem(id);
      setWishlist(payload.items || []);
      addToast({ variant: "success", message: "Removed from wishlist." });
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.error || "Unable to remove this item." });
    }
  };

  const handleMoveToCart = async (item) => {
    try {
      await addToCart(item.product_id, 1);
      const payload = await removeWishlistItem(item.id);
      setWishlist(payload.items || []);
      addToast({ variant: "success", message: "Moved to cart." });
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.error || "Unable to move this item to cart." });
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-4xl px-4 pt-28 text-[#FFF8F0]/70">Loading wishlist...</div>;
  }

  if (!wishlist.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 pt-28">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-14 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-[#FFDAB9]" />
          <h1 className="font-serif text-3xl font-bold text-[#FFF8F0]">Wishlist is empty</h1>
          <p className="mt-3 text-sm text-[#FFF8F0]/60">Save your favorite products here for later.</p>
          <Link to="/products" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#A67B5B] px-5 py-3 text-sm font-bold text-[#FFF8F0]">Browse products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#FFDAB9]">Wishlist</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#FFF8F0]">Saved favorites</h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {wishlist.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10">
            <div className="h-52 bg-gradient-to-br from-[#A67B5B]/25 via-[#A67B5B]/10 to-transparent p-5">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="h-full w-full rounded-[1.5rem] object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 bg-[#2E1F13]/60 text-[#FFDAB9]/60">
                  No image
                </div>
              )}
            </div>
            <div className="space-y-4 p-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#FFF8F0]">{item.name}</h2>
                <p className="mt-1 text-sm text-[#FFF8F0]/55">{item.material} • {item.color}</p>
              </div>
              <p className="text-xl font-bold text-[#FFDAB9]">Rs {Number(item.price).toLocaleString("en-IN")}</p>
              <div className="flex gap-3">
                <button onClick={() => handleMoveToCart(item)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#A67B5B] px-4 py-3 font-semibold text-[#FFF8F0]">
                  <ShoppingCart className="h-4 w-4" />
                  Move to cart
                </button>
                <button onClick={() => handleRemove(item.id)} className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-red-100">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
