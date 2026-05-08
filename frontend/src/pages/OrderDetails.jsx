import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { addToCart, cancelOrder, getOrderById } from "../services/api";
import { useToast } from "../context/ToastContext";

const OrderDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id);
      setOrder(data);
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.error || "Unable to load the order details." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    if (searchParams.get("success") === "1") {
      addToast({ variant: "success", title: "Order confirmed", message: "Your order was placed successfully." });
    }
  }, [id]);

  const handleBuyAgain = async () => {
    try {
      for (const item of order.items) {
        await addToCart({ product_id: item.product_id, quantity: item.quantity });
      }
      addToast({ variant: "success", message: "Items added back to cart." });
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.error || "Unable to add these items again." });
    }
  };

  const handleCancel = async () => {
    try {
      await cancelOrder(order.id);
      addToast({ variant: "success", message: "Order cancelled successfully." });
      await loadOrder();
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.error || "Unable to cancel this order." });
    }
  };

  if (loading) return <div className="mx-auto max-w-4xl px-4 pt-28 text-[#FFF8F0]/70">Loading order details...</div>;
  if (!order) return <div className="mx-auto max-w-4xl px-4 pt-28 text-red-200">Order not found.</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link to="/orders" className="text-sm text-[#FFDAB9] hover:text-white transition-colors">Back to orders</Link>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#FFF8F0]">Order #{order.id}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10">
          <h2 className="text-xl font-semibold text-[#FFF8F0]">Items</h2>
          <div className="mt-6 space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-[#1d120c]/60 p-4">
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-[#FFF8F0]/55">{item.material} • {item.color}</p>
                  <p className="mt-1 text-sm text-[#FFF8F0]/55">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-[#FFDAB9]">Rs {(Number(item.unit_price) * Number(item.quantity)).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10">
            <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-[#FFF8F0]/70"><span>Status</span><span>{order.status}</span></div>
            <div className="flex items-center justify-between text-sm text-[#FFF8F0]/70"><span>Payment</span><span>{order.payment_method || "upi"}</span></div>
            <div className="flex items-center justify-between text-sm text-[#FFF8F0]/70"><span>Subtotal</span><span>Rs {Number(order.subtotal || order.total_price).toLocaleString("en-IN")}</span></div>
            <div className="flex items-center justify-between text-sm text-[#FFF8F0]/70"><span>Delivery</span><span>Rs {Number(order.shipping_charge || 0).toLocaleString("en-IN")}</span></div>
            <div className="flex items-center justify-between text-sm text-[#FFF8F0]/70"><span>Discount</span><span>Rs {Number(order.discount_amount || 0).toLocaleString("en-IN")}</span></div>
            <div className="flex items-center justify-between border-t border-white/10 pt-4"><span className="font-semibold text-white">Total</span><span className="text-2xl font-bold text-white">Rs {Number(order.total_price).toLocaleString("en-IN")}</span></div>
            <div className="rounded-2xl border border-white/10 bg-[#1d120c]/70 p-4 text-sm text-[#FFF8F0]/65">
              Estimated delivery: {order.delivery_eta || "4-6 days"} · {order.delivery_zone || "Standard"} · {Math.round(Number(order.delivery_distance_km || 0)) || "--"} km
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button onClick={handleBuyAgain} className="rounded-2xl bg-[#A67B5B] px-4 py-3 font-bold text-white transition hover:bg-[#8B654A]">Buy Again</button>
            {order.status !== "cancelled" ? <button onClick={handleCancel} className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 font-bold text-red-100">Cancel Order</button> : null}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetails;
