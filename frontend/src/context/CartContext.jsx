// @refresh reset
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  addToCart as addToCartRequest,
  getCart,
  placeOrder as placeOrderRequest,
  removeCartItem as removeCartItemRequest,
  updateCartItem as updateCartItemRequest
} from "../services/api";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");

  const applyCartData = (payload) => {
    setCartItems(payload?.items || []);
    setCartCount(Number(payload?.itemCount || 0));
    setCartTotal(Number(payload?.totalPrice || 0));
  };

  const refreshCart = async ({ silent = false } = {}) => {
    if (!localStorage.getItem("user_id")) {
      applyCartData({ items: [], itemCount: 0, totalPrice: 0 });
      setCartError("");
      setIsCartLoading(false);
      return { items: [], itemCount: 0, totalPrice: 0 };
    }

    if (!silent) setIsCartLoading(true);

    try {
      const payload = await getCart();
      applyCartData(payload);
      setCartError("");
      return payload;
    } catch (error) {
      const message = error?.response?.data?.error || "Unable to load your cart right now.";
      setCartError(message);
      if (!silent) applyCartData({ items: [], itemCount: 0, totalPrice: 0 });
      throw error;
    } finally {
      if (!silent) setIsCartLoading(false);
    }
  };

  useEffect(() => {
    // Initial cart hydration for navbar badge and persisted cart state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshCart().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = async (product_id, quantity = 1) => {
    const payload = await addToCartRequest({ product_id, quantity });
    applyCartData(payload);
    setCartError("");
    return payload;
  };

  const updateCartItem = async (id, quantity) => {
    const payload = await updateCartItemRequest({ id, quantity });
    applyCartData(payload);
    setCartError("");
    return payload;
  };

  const removeCartItem = async (id) => {
    const payload = await removeCartItemRequest(id);
    applyCartData(payload);
    setCartError("");
    return payload;
  };

  const placeOrder = async (data) => {
    const payload = await placeOrderRequest(data);
    applyCartData({ items: [], itemCount: 0, totalPrice: 0 });
    setCartError("");
    return payload;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isCartLoading,
        cartError,
        refreshCart,
        addToCart,
        updateCartItem,
        removeCartItem,
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
