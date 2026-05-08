import React, { useEffect, useState } from 'react';
import { X, Printer, Download, CheckCircle2, QrCode, IndianRupee } from 'lucide-react';
import { getReceipt } from '../services/api';

const ReceiptModal = ({ orderId, onClose }) => {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchReceipt();
    }
  }, [orderId]);

  const fetchReceipt = async () => {
    try {
      const data = await getReceipt(orderId);
      setReceipt(data);
    } catch (error) {
      console.error("Error fetching receipt:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!orderId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#A67B5B] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Transaction Receipt</h2>
              <p className="text-white/80 text-xs">Payment Successful</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#FDFBF7] receipt-paper">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-[#A67B5B] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#A67B5B] font-medium">Generating Receipt...</p>
            </div>
          ) : receipt ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              {/* Brand Header */}
              <div className="text-center space-y-2 border-b border-dashed border-gray-300 pb-6">
                <h1 className="text-3xl font-black tracking-tighter text-[#4A3728]">FURNI<span className="text-[#A67B5B]">AI</span></h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold">Premium Furniture Hub</p>
                <p className="text-gray-400 text-xs">123 Luxury Lane, Design District, NY 10001</p>
              </div>

              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-400 uppercase text-[10px] font-bold tracking-wider">Receipt No</p>
                  <p className="font-mono font-bold text-[#4A3728]">{receipt.receipt_number}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-gray-400 uppercase text-[10px] font-bold tracking-wider">Date</p>
                  <p className="font-semibold text-[#4A3728]">{new Date(receipt.generated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400 uppercase text-[10px] font-bold tracking-wider">Order ID</p>
                  <p className="font-semibold text-[#4A3728]">#{receipt.order_id}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-gray-400 uppercase text-[10px] font-bold tracking-wider">Payment Method</p>
                  <p className="font-semibold text-[#4A3728] uppercase">{receipt.order.payment_method}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-4">
                <div className="border-b border-dashed border-gray-300 pb-2 flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <span>Description</span>
                  <div className="flex gap-8">
                    <span className="w-16 text-right">Qty</span>
                    <span className="w-20 text-right">Amount</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {receipt.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-bold text-[#4A3728] leading-tight">{item.name}</p>
                        <p className="text-xs text-gray-400">Unit Price: ₹{item.unit_price}</p>
                      </div>
                      <div className="flex gap-8">
                        <span className="w-16 text-right font-medium text-gray-600">x{item.quantity}</span>
                        <span className="w-20 text-right font-bold text-[#4A3728]">₹{(item.unit_price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-dashed border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{receipt.order.subtotal?.toLocaleString() || "0"}</span>
                </div>
                {receipt.order.shipping_charge > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping Fee</span>
                    <span>₹{receipt.order.shipping_charge?.toLocaleString()}</span>
                  </div>
                )}
                {receipt.order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount {receipt.order.coupon_code && `(${receipt.order.coupon_code})`}</span>
                    <span>-₹{receipt.order.discount_amount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-black text-[#4A3728] pt-2 border-t border-gray-200">
                  <span>GRAND TOTAL</span>
                  <span className="flex items-center"><IndianRupee className="w-4 h-4 mr-1" />{receipt.order.total_price?.toLocaleString()}</span>
                </div>
              </div>

              {/* Footer / QR */}
              <div className="pt-8 flex flex-col items-center gap-4 text-center">
                <div className="p-2 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <QrCode className="w-16 h-16 text-[#4A3728]" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#4A3728]">SCAN TO VERIFY</p>
                  <p className="text-[10px] text-gray-400 max-w-[200px]">Thank you for choosing FurniAI. Your furniture is being prepared for delivery.</p>
                </div>
              </div>

              {/* Cutting Line */}
              <div className="relative h-4 flex items-center">
                <div className="w-full border-b border-dashed border-gray-300"></div>
                <div className="absolute left-0 w-4 h-4 bg-[#FDFBF7] -translate-x-1/2 rounded-full border-r border-dashed border-gray-300"></div>
                <div className="absolute right-0 w-4 h-4 bg-[#FDFBF7] translate-x-1/2 rounded-full border-l border-dashed border-gray-300"></div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-red-500 font-medium">Failed to load receipt details.</div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white p-6 border-t border-gray-100 flex gap-4">
          <button 
            onClick={handlePrint}
            className="flex-1 py-3 px-4 border-2 border-[#A67B5B] text-[#A67B5B] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#A67B5B]/5 transition-colors"
          >
            <Printer className="w-5 h-5" />
            Print Receipt
          </button>
          <button 
            onClick={handlePrint} // Usually same as print to PDF
            className="flex-1 py-3 px-4 bg-[#A67B5B] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#8B654A] shadow-lg shadow-[#A67B5B]/20 transition-all hover:-translate-y-0.5"
          >
            <Download className="w-5 h-5" />
            Save PDF
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @media print {
          .fixed { position: static; background: white; padding: 0; }
          .bg-black\\/60 { display: none; }
          .shadow-2xl { shadow: none; }
          .receipt-paper { background: white; padding: 0; }
          .animate-in { animation: none; }
          button { display: none; }
          .bg-white { width: 100%; max-width: 100%; height: auto; max-height: none; }
        }
        .receipt-paper {
          background-image: radial-gradient(#A67B5B10 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default ReceiptModal;
