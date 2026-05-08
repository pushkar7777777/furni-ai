import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { getMyProfile } from "../services/api";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { estimateDelivery } from "../utils/checkoutPricing";
import PaymentMethods from "../components/PaymentMethods";
import DeliveryValidator from "../components/DeliveryValidator";
import ReceiptModal from "../components/ReceiptModal";
import { initScrollAnimations } from "../utils/scrollAnimations";


const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartCount, isCartLoading, placeOrder } = useCart();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("upi");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [form, setForm] = useState({
    customerName: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    landmark: "",
    couponCode: ""
  });
  const [successOrderId, setSuccessOrderId] = useState(null);


  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getMyProfile();
        setForm((current) => ({
          ...current,
          customerName: profile.name || "",
          addressLine: profile.address_line1 || "",
          city: profile.city || "",
          state: profile.state || "",
          postalCode: profile.postal_code || ""
        }));
      } catch {
        // optional prefill
      }
    };
    loadProfile();
    
    // Initialize scroll animations
    initScrollAnimations();
  }, []);

  const delivery = estimateDelivery({
    cartItems,
    subtotal: cartTotal,
    city: form.city,
    state: form.state,
    postalCode: form.postalCode,
    paymentMethod: selectedPaymentMethod
  });

  const shippingCharge = deliveryInfo?.charges || delivery.shippingCharge;
  const estimatedDiscount = form.couponCode.toUpperCase() === "SAVE10"
    ? cartTotal * 0.1
    : form.couponCode.toUpperCase() === "FLAT500"
      ? Math.min(cartTotal, 500)
      : form.couponCode.toUpperCase() === "FREESHIP"
        ? shippingCharge
        : 0;
  const grandTotal = Math.max(0, cartTotal + shippingCharge - estimatedDiscount);

  const handlePlaceOrder = async () => {
    if (!form.customerName || !form.addressLine || !form.city || !form.state || !form.postalCode) {
      setError("Please complete the delivery address before placing your order.");
      return;
    }

    if (!deliveryInfo?.available) {
      setError("Please select a serviceable delivery address.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const response = await placeOrder({
        ...form,
        paymentMethod: selectedPaymentMethod,
        shippingCharge,
        deliveryDistanceKm: delivery.distanceKm,
        deliveryZone: delivery.zone,
        deliveryEta: delivery.eta,
        couponCode: form.couponCode
      });
      addToast({ variant: "success", message: "Order placed successfully." });
      setSuccessOrderId(response.orderId);
      // Removed navigate so user can see receipt
      // navigate(`/orders/${response.orderId}?success=1`);

    } catch (err) {
      setError(err?.response?.data?.error || "Checkout failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressChange = (updatedAddress) => {
    setForm(updatedAddress);
  };

  const handleDeliveryValidation = (info) => {
    setDeliveryInfo(info);
  };

  if (isCartLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-24">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-[#FFF8F0]">
          <LoaderCircle className="h-5 w-5 animate-spin text-[#FFDAB9]" />
          Preparing checkout...
        </div>
      </div>
    );
  }

  if (!cartItems.length && !successOrderId) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-28 text-center sm:px-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12">
          <h1 className="font-serif text-3xl font-bold text-[#FFF8F0]">Your cart is empty</h1>
          <p className="mt-3 text-sm text-[#FFF8F0]/60">Add items before moving to checkout.</p>
          <Link to="/products" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#A67B5B] px-5 py-3 text-sm font-bold text-[#FFF8F0] transition hover:bg-[#8B654A]">
            Back to Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8" data-scroll-animation="fade-in">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#FFDAB9]">Checkout</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#FFF8F0]">Place your order</h1>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100" data-scroll-animation="slide-up">
          <AlertCircle className="h-4 w-4 text-red-300" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
        {/* Main Checkout Section */}
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10" data-scroll-animation="slide-left">
          {/* Delivery Address Section */}
          <div className="mb-8 bg-[#1d120c]/60 rounded-2xl p-6 border border-white/10" data-scroll-animation="slide-up">
            <h2 className="text-lg font-semibold text-[#FFF8F0] mb-4">Delivery Address</h2>
            
            <div className="grid gap-3">
              <label className="grid gap-2 text-sm text-[#FFF8F0]/80">
                Full Name
                <input 
                  value={form.customerName} 
                  onChange={(e) => handleAddressChange({ ...form, customerName: e.target.value })} 
                  className="rounded-2xl border border-white/10 bg-[#1d120c]/70 px-4 py-3 text-[#FFF8F0] outline-none" 
                  placeholder="Enter your full name"
                />
              </label>

              <label className="grid gap-2 text-sm text-[#FFF8F0]/80">
                Address Line
                <input 
                  value={form.addressLine} 
                  onChange={(e) => handleAddressChange({ ...form, addressLine: e.target.value })} 
                  className="rounded-2xl border border-white/10 bg-[#1d120c]/70 px-4 py-3 text-[#FFF8F0] outline-none" 
                  placeholder="House number, Building name, Street"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-2 text-sm text-[#FFF8F0]/80">
                  City
                  <input 
                    value={form.city} 
                    onChange={(e) => handleAddressChange({ ...form, city: e.target.value })} 
                    className="rounded-2xl border border-white/10 bg-[#1d120c]/70 px-4 py-3 text-[#FFF8F0] outline-none" 
                    placeholder="City"
                  />
                </label>
                <label className="grid gap-2 text-sm text-[#FFF8F0]/80">
                  State
                  <input 
                    value={form.state} 
                    onChange={(e) => handleAddressChange({ ...form, state: e.target.value })} 
                    className="rounded-2xl border border-white/10 bg-[#1d120c]/70 px-4 py-3 text-[#FFF8F0] outline-none" 
                    placeholder="State"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm text-[#FFF8F0]/80">
                Postal Code (6 digits)
                <input 
                  value={form.postalCode} 
                  maxLength="6"
                  onChange={(e) => handleAddressChange({ ...form, postalCode: e.target.value })} 
                  className="rounded-2xl border border-white/10 bg-[#1d120c]/70 px-4 py-3 text-[#FFF8F0] outline-none" 
                  placeholder="Enter 6-digit pincode"
                />
              </label>

              <label className="grid gap-2 text-sm text-[#FFF8F0]/80">
                Landmark (Optional)
                <input 
                  value={form.landmark} 
                  onChange={(e) => handleAddressChange({ ...form, landmark: e.target.value })} 
                  className="rounded-2xl border border-white/10 bg-[#1d120c]/70 px-4 py-3 text-[#FFF8F0] outline-none" 
                  placeholder="e.g., Near XYZ park"
                />
              </label>
            </div>
          </div>

          {/* Delivery Validator */}
          <div data-scroll-animation="slide-up" data-scroll-delay="100">
            <div className="text-[#FFF8F0] bg-[#1d120c]/40 rounded-2xl p-4 mb-6">
              <DeliveryValidator 
                address={form}
                onAddressChange={handleAddressChange}
                onValidationChange={handleDeliveryValidation}
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div data-scroll-animation="slide-up" data-scroll-delay="200">
            <div className="text-[#FFF8F0] bg-[#1d120c]/40 rounded-2xl p-4">
              <PaymentMethods 
                selectedMethod={selectedPaymentMethod}
                onMethodChange={setSelectedPaymentMethod}
                orderTotal={grandTotal}
              />
            </div>
          </div>

          {/* Coupon Code */}
          <div className="mt-6 bg-[#1d120c]/60 rounded-2xl p-6 border border-white/10" data-scroll-animation="slide-up" data-scroll-delay="300">
            <h3 className="text-sm font-semibold text-[#FFF8F0] mb-3">Coupon Code</h3>
            <input 
              value={form.couponCode} 
              onChange={(e) => handleAddressChange({ ...form, couponCode: e.target.value })} 
              className="w-full rounded-2xl border border-white/10 bg-[#1d120c]/70 px-4 py-3 text-[#FFF8F0] outline-none text-sm" 
              placeholder="Enter coupon code (SAVE10, FLAT500, FREESHIP)"
            />
            <p className="text-xs text-[#FFF8F0]/50 mt-2">Available codes: SAVE10 (10%), FLAT500 (₹500), FREESHIP (Free delivery)</p>
          </div>
        </section>

        {/* Order Summary Sidebar */}
        <aside className="h-fit rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#A67B5B]/15 to-white/[0.03] p-6 shadow-xl shadow-black/10 sticky top-32" data-scroll-animation="slide-right">
          <h2 className="text-xl font-semibold text-[#FFF8F0]">Order summary</h2>
          <div className="mt-6 space-y-3">
            {cartItems.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between text-sm text-[#FFF8F0]/70" data-scroll-animation="fade-in" data-scroll-delay={`${index * 50}`}>
                <span>{item.name} × {item.quantity}</span>
                <span>Rs {(Number(item.price) * Number(item.quantity)).toLocaleString("en-IN")}</span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-3 text-sm text-[#FFF8F0]/70">
              <div className="flex items-center justify-between"><span>Items</span><span>{cartCount}</span></div>
              <div className="mt-2 flex items-center justify-between"><span>Subtotal</span><span>Rs {cartTotal.toLocaleString("en-IN")}</span></div>
              <div className="mt-2 flex items-center justify-between">
                <span>Delivery charges</span>
                <span>{shippingCharge === 0 ? 'Free' : `Rs ${shippingCharge.toLocaleString("en-IN")}`}</span>
              </div>
              <div className="mt-2 flex items-center justify-between"><span>Discount</span><span className="text-green-400">-Rs {estimatedDiscount.toLocaleString("en-IN")}</span></div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#FFF8F0]">Grand total</span>
                <span className="text-3xl font-bold text-[#FFF8F0]">Rs {grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1d120c]/70 p-4 text-sm text-[#FFF8F0]/65">
              Delivery charge is calculated from distance, city zone, item count, bulky-item handling, and payment method.
            </div>
          </div>

          <button
            type="button"
            disabled={!cartItems.length || isSubmitting || !deliveryInfo?.available}
            onClick={handlePlaceOrder}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#A67B5B] px-4 py-3.5 text-sm font-bold text-[#FFF8F0] transition hover:bg-[#8B654A] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>

          <Link to="/cart" className="mt-4 inline-flex items-center gap-2 text-sm text-[#FFDAB9] transition hover:text-[#FFF8F0]">
            Back to cart
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>

      {successOrderId && (
        <ReceiptModal 
          orderId={successOrderId} 
          onClose={() => navigate(`/orders/${successOrderId}`)} 
        />
      )}
    </div>

  );
};

export default Checkout;
