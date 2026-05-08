import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCcw, ReceiptText } from "lucide-react";
import { addToCart, cancelOrder, getOrderById, getOrders } from "../services/api";
import ReceiptModal from "../components/ReceiptModal";

import { useToast } from "../context/ToastContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewReceiptOrderId, setViewReceiptOrderId] = useState(null);
  const { addToast } = useToast();


  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.error || "Unable to load your orders." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (orderId) => {
    try {
      await cancelOrder(orderId);
      addToast({ variant: "success", message: "Order cancelled successfully." });
      await loadOrders();
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.error || "Unable to cancel order." });
    }
  };

  const handleBuyAgain = async (orderId) => {
    try {
      const order = await getOrderById(orderId);
      for (const item of order.items) {
        await addToCart({ product_id: item.product_id, quantity: item.quantity });
      }
      addToast({ variant: "success", message: "Items added back to cart." });
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.error || "Unable to buy these items again." });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#FFDAB9]">Orders</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#FFF8F0]">Your order history</h1>
      </div>

      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-[#FFF8F0]/70">Loading orders...</div>
      ) : !orders.length ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-[#FFF8F0]/70">You have not placed any orders yet.</p>
          <Link to="/products" className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#A67B5B] px-5 py-3 font-bold text-white">
            Start shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-[#FFDAB9]">Order #{order.id}</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">Rs {Number(order.total_price).toLocaleString("en-IN")}</h2>
                  <p className="mt-2 text-sm text-[#FFF8F0]/60">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#FFF8F0]">{order.status}</span>
                   <Link to={`/orders/${order.id}`} className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-[#FFF8F0] hover:bg-white/5">View details</Link>
                  <button onClick={() => setViewReceiptOrderId(order.id)} className="rounded-2xl border border-[#A67B5B]/30 bg-[#A67B5B]/10 px-4 py-2 text-sm font-semibold text-[#A67B5B] inline-flex items-center gap-2">
                    <ReceiptText className="w-4 h-4" />
                    Receipt
                  </button>
                  <button onClick={() => handleBuyAgain(order.id)} className="inline-flex items-center gap-2 rounded-2xl border border-[#FFDAB9]/20 bg-[#FFDAB9]/10 px-4 py-2 text-sm font-semibold text-[#FFDAB9]">

                    <RefreshCcw className="h-4 w-4" />
                    Buy again
                  </button>
                  {order.status !== "cancelled" ? <button onClick={() => handleCancel(order.id)} className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100">Cancel</button> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {viewReceiptOrderId && (
        <ReceiptModal 
          orderId={viewReceiptOrderId} 
          onClose={() => setViewReceiptOrderId(null)} 
        />
      )}
    </div>

  );
};

export default Orders;
