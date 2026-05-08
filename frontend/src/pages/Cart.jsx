import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, LoaderCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartCount, isCartLoading, cartError, updateCartItem, removeCartItem } = useCart();
  const [busyId, setBusyId] = useState(null);
  const [pageError, setPageError] = useState("");

  const handleQuantityChange = async (item, nextQuantity) => {
    try {
      setBusyId(item.id);
      setPageError("");
      await updateCartItem(item.id, nextQuantity);
    } catch (err) {
      setPageError(err?.response?.data?.error || "Unable to update quantity.");
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (id) => {
    try {
      setBusyId(id);
      setPageError("");
      await removeCartItem(id);
    } catch (err) {
      setPageError(err?.response?.data?.error || "Unable to remove this item.");
    } finally {
      setBusyId(null);
    }
  };

  if (isCartLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-24">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-[#FFF8F0]">
          <LoaderCircle className="h-5 w-5 animate-spin text-[#FFDAB9]" />
          Loading your cart...
        </div>
      </div>
    );
  }

  if (cartError && !cartItems.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-28 text-center sm:px-6">
        <div className="rounded-[2rem] border border-red-400/20 bg-red-500/10 px-6 py-12">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-300" />
          <p className="text-red-100">{cartError}</p>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 pt-28 sm:px-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-14 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-[#FFDAB9]" />
          <h1 className="font-serif text-3xl font-bold text-[#FFF8F0]">Cart is empty</h1>
          <p className="mt-3 text-sm text-[#FFF8F0]/60">Add a few pieces from the collection to continue to checkout.</p>
          <Link to="/products" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#A67B5B] px-5 py-3 text-sm font-bold text-[#FFF8F0] transition hover:bg-[#8B654A]">
            Browse Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#FFDAB9]">Your cart</p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-[#FFF8F0]">Review your selections</h1>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#FFF8F0]/75">
          {cartCount} item{cartCount === 1 ? "" : "s"} ready for checkout
        </div>
      </div>

      {(pageError || cartError) && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          <AlertCircle className="h-4 w-4 text-red-300" />
          {pageError || cartError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <section className="space-y-4">
          {cartItems.map((item) => {
            const isBusy = busyId === item.id;

            return (
              <article key={item.id} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 overflow-hidden rounded-[1.5rem] bg-[#1d120c]">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#FFDAB9]/60">
                          <ShoppingBag className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#FFF8F0]">{item.name}</h2>
                      <p className="mt-1 text-sm text-[#FFF8F0]/60">
                        {item.material || "Furniture"} • {item.color || "Premium finish"}
                      </p>
                      <p className="mt-3 text-lg font-semibold text-[#FFDAB9]">
                        Rs {Number(item.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-2xl border border-white/10 bg-[#1d120c] p-1">
                      <button
                        type="button"
                        disabled={isBusy || Number(item.quantity) <= 1}
                        onClick={() => handleQuantityChange(item, Number(item.quantity) - 1)}
                        className="rounded-xl p-2 text-[#FFF8F0] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-white/30"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-10 text-center text-sm font-bold text-[#FFF8F0]">{item.quantity}</span>
                      <button
                        type="button"
                        disabled={isBusy || Number(item.quantity) >= Number(item.stock)}
                        onClick={() => handleQuantityChange(item, Number(item.quantity) + 1)}
                        className="rounded-xl p-2 text-[#FFF8F0] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-white/30"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleRemove(item.id)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="h-fit rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 shadow-xl shadow-black/10">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FFDAB9]">Order summary</p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-[#FFF8F0]/65">
              <span>Items</span>
              <span>{cartCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[#FFF8F0]/65">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#FFF8F0]">Total</span>
                <span className="text-3xl font-bold text-[#FFF8F0]">Rs {cartTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={!cartItems.length}
            onClick={() => navigate("/checkout")}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#A67B5B] px-4 py-3.5 text-sm font-bold text-[#FFF8F0] transition hover:bg-[#8B654A] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
