import React, { useState, useEffect } from 'react';
import { getInventoryStats, getLowStockProducts, getInventoryLogs, getProducts, updateStock } from '../../services/api';
import { Package, TrendingDown, AlertTriangle, RefreshCw, ArrowDownCircle, ArrowUpCircle, History, IndianRupee, CheckCircle2, X, BarChart2, Zap } from 'lucide-react';

const StatCard = ({ label, value, sub, icon, color }) => (
  <div className="glass-panel rounded-[32px] p-8 flex flex-col gap-6 border-white/5 hover:border-[#FFDAB9]/20 transition-all group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 ${color} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-[0.4em] text-[#FFDAB9]/40 font-black mb-2">{label}</p>
      <p className="text-3xl font-serif font-bold text-[#FFF8F0]">{value}</p>
      {sub && <p className="text-[10px] text-[#A67B5B] font-bold mt-2 uppercase tracking-tight">{sub}</p>}
    </div>
  </div>
);

const Inventory = () => {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [logs, setLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustModal, setAdjustModal] = useState(null);
  const [form, setForm] = useState({ quantity: '', reference: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [s, ls, lg, pr] = await Promise.all([
        getInventoryStats(), getLowStockProducts(), getInventoryLogs(), getProducts()
      ]);
      setStats(s); setLowStock(ls); setLogs(lg); setProducts(pr);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAdjust = async (e) => {
    e.preventDefault();
    if (!form.quantity || Number(form.quantity) <= 0) return;
    try {
      setSubmitting(true);
      await updateStock({
        product_id: adjustModal.product.id,
        type: adjustModal.type,
        quantity: Number(form.quantity),
        reference: form.reference,
        notes: form.notes
      });
      showToast(`Stock ${adjustModal.type === 'IN' ? 'Restocked' : 'Issued'} for ${adjustModal.product.name}`);
      setAdjustModal(null);
      setForm({ quantity: '', reference: '', notes: '' });
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.error || 'System operation failed', 'error');
    } finally { setSubmitting(false); }
  };

  const fmtCurrency = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`;

  return (
    <div className="max-w-7xl mx-auto space-y-12 text-[#FFF8F0]">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-12 right-12 z-[100] flex items-center gap-4 px-6 py-4 rounded-[20px] shadow-2xl backdrop-blur-3xl border border-white/10 animate-in slide-in-from-right duration-500 ${toast.type === 'error' ? 'bg-red-500/80 text-white' : 'bg-[#A67B5B]/80 text-[#FFF8F0]'}`}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
             {toast.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </div>
          <span className="font-bold tracking-wide text-sm">{toast.msg}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 reveal-up">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-[1px] bg-[#A67B5B]" />
             <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FFDAB9]">Vault Administration</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight">Vanguard <span className="italic font-light text-[#FFDAB9]">Inventory</span></h1>
        </div>
        <button onClick={fetchAll} className="glass-panel px-6 py-3 rounded-xl border-white/5 hover:bg-white/5 transition-all flex items-center gap-2 group">
          <RefreshCw className={`w-4 h-4 text-[#FFDAB9] ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest">Synchronize</span>
        </button>
      </div>

      {loading && !stats ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-6">
          <RefreshCw className="w-12 h-12 text-[#FFDAB9] animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#FFDAB9]/40 font-black">Decrypting Assets</p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 reveal-up">
            <StatCard label="Total Assets" value={stats?.total_products ?? 0} icon={<Package className="w-6 h-6 text-[#FFDAB9]" />} />
            <StatCard label="Units in Vault" value={stats?.total_units ?? 0} sub="Global Accumulation" icon={<BarChart2 className="w-6 h-6 text-[#A67B5B]" />} />
            <StatCard label="Asset Valuation" value={fmtCurrency(stats?.total_stock_value)} sub="Net Market Cap" icon={<IndianRupee className="w-6 h-6 text-emerald-400" />} />
            <StatCard label="Critical Depth" value={stats?.low_stock_count ?? 0} sub={`${stats?.out_of_stock_count ?? 0} Depleted Items`} icon={<Zap className="w-6 h-6 text-red-400" />} />
          </div>

          {/* Low Stock Alerts */}
          {lowStock.length > 0 && (
            <div className="glass-panel border-red-500/20 rounded-[40px] p-8 md:p-10 reveal-up relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                   <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="font-serif text-2xl font-bold">Critical Alert <span className="text-red-400/50">({lowStock.length})</span></h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowStock.map(p => (
                  <div key={p.id} className="glass-panel rounded-2xl border-white/5 p-5 flex justify-between items-center bg-white/2 hover:bg-white/5 transition-all">
                    <div>
                      <p className="font-bold text-[#FFF8F0] tracking-tight">{p.name}</p>
                      <p className={`text-[10px] font-black mt-2 uppercase tracking-widest ${p.stock === 0 ? 'text-red-400' : 'text-amber-400/80'}`}>
                        {p.stock === 0 ? 'STATUS: DEPLETED' : `SURPLUS: ${p.stock} UNITS`}
                      </p>
                    </div>
                    <button onClick={() => { setAdjustModal({ product: p, type: 'IN' }); setForm({ quantity: '', reference: '', notes: '' }); }}
                      className="bg-[#A67B5B] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-[#8B654A] transition-all shadow-lg shadow-black/20">
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="glass-panel rounded-[48px] border-white/5 shadow-3xl overflow-hidden reveal-up">
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                 <Package className="w-6 h-6 text-[#FFDAB9]" />
                 <h2 className="font-serif text-2xl font-bold">Ledger Overview</h2>
              </div>
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#FFF8F0]/20">{products.length} catalogued items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/2 text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black">
                    <th className="px-10 py-6">Product Identity</th>
                    <th className="px-6 py-6 font-black">Material Integrity</th>
                    <th className="px-6 py-6 font-black">Valuation</th>
                    <th className="px-6 py-6 text-center font-black">Inventory</th>
                    <th className="px-6 py-6 font-black">Risk Status</th>
                    <th className="px-10 py-6 text-center font-black">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-10 py-6">
                        <p className="font-bold text-[#FFF8F0] text-base group-hover:text-[#FFDAB9] transition-colors">{p.name}</p>
                        <p className="text-[11px] text-[#A67B5B] uppercase font-bold tracking-widest mt-0.5">{p.color}</p>
                      </td>
                      <td className="px-6 py-6">
                         <span className="text-sm font-medium text-[#FFF8F0]/60">{p.material}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-base font-serif font-bold text-[#A67B5B]">{fmtCurrency(p.price)}</span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className={`text-2xl font-serif font-black ${p.stock === 0 ? 'text-red-400' : p.stock < 10 ? 'text-amber-400' : 'text-[#FFDAB9]'}`}>{p.stock}</span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${p.stock === 0 ? 'bg-red-400' : p.stock < 10 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                           <span className={`text-[10px] font-black uppercase tracking-widest ${p.stock === 0 ? 'text-red-400' : p.stock < 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                             {p.stock === 0 ? 'Extinguished' : p.stock < 10 ? 'Vulnerable' : 'Robust'}
                           </span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center justify-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setAdjustModal({ product: p, type: 'IN' }); setForm({ quantity: '', reference: '', notes: '' }); }}
                            className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center hover:bg-emerald-400 hover:text-white transition-all text-emerald-400">
                            <ArrowUpCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => { setAdjustModal({ product: p, type: 'OUT' }); setForm({ quantity: '', reference: '', notes: '' }); }}
                            className="w-10 h-10 rounded-xl bg-red-400/10 border border-red-400/20 flex items-center justify-center hover:bg-red-400 hover:text-white transition-all text-red-400 disabled:opacity-20" disabled={p.stock === 0}>
                            <ArrowDownCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Trail Section */}
          <div className="glass-panel rounded-[48px] border-white/5 shadow-2xl overflow-hidden reveal-up">
            <div className="px-10 py-8 border-b border-white/5 flex items-center gap-4 bg-white/[0.02]">
              <div className="w-10 h-10 rounded-2xl bg-[#A67B5B]/10 flex items-center justify-center">
                 <History className="w-5 h-5 text-[#A67B5B]" />
              </div>
              <div>
                 <h2 className="font-serif text-2xl font-bold">Audit Chronicle</h2>
                 <p className="text-[10px] uppercase font-black tracking-widest text-white/20 mt-1">Archiving latest 100 asset migrations</p>
              </div>
            </div>
            {logs.length === 0 ? (
              <div className="py-24 text-center">
                <Package className="w-16 h-16 mx-auto mb-6 opacity-5" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">Legacy Ledger Empty</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {logs.map(log => (
                  <div key={log.id} className="px-10 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-all ${log.type === 'IN' ? 'bg-emerald-400/5 text-emerald-400 border border-emerald-400/10 group-hover:bg-emerald-400 group-hover:text-white' : 'bg-red-400/5 text-red-400 border border-red-400/10 group-hover:bg-red-400 group-hover:text-white'}`}>
                        {log.type === 'IN' ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="text-base font-bold text-[#FFF8F0] mb-1">{log.product_name}</p>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] uppercase font-black text-[#A67B5B] tracking-widest">{log.reference || 'SYSTEM_AUTO'}</span>
                           {log.notes && <span className="text-[10px] text-white/20">· {log.notes}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-serif font-black mb-1 ${log.type === 'IN' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {log.type === 'IN' ? '+' : '−'}{log.quantity}
                      </p>
                      <p className="text-[10px] uppercase font-black tracking-tighter text-white/20">{new Date(log.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Adjust Stock Modal */}
      {adjustModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2E1F13]/60 backdrop-blur-2xl p-6 animate-in fade-in duration-300">
          <div className="glass-panel border-white/10 shadow-3xl w-full max-w-lg p-10 rounded-[48px] reveal-up">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight">{adjustModal.type === 'IN' ? 'Procure Inventory' : 'Issue Inventory'}</h2>
                <div className="flex items-center gap-3 mt-3">
                   <div className="w-2 h-2 rounded-full bg-[#FFDAB9]" />
                   <p className="text-sm font-bold text-[#A67B5B] uppercase tracking-widest">{adjustModal.product.name}</p>
                </div>
              </div>
              <button onClick={() => setAdjustModal(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#FFF8F0]/30 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white/5 rounded-3xl p-6 mb-10 border border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFDAB9]/40">Current Vault Standing</span>
              <span className="text-2xl font-serif font-bold text-[#FFF8F0]">{adjustModal.product.stock} <span className="text-[10px] uppercase font-black tracking-widest text-white/20">Units</span></span>
            </div>

            <form onSubmit={handleAdjust} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Magnitude *</label>
                <div className="relative">
                   <Zap className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A67B5B]" />
                   <input type="number" min="1" value={form.quantity}
                    onChange={e => setForm({ ...form, quantity: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-[#A67B5B] transition-all text-xl font-serif font-bold"
                    placeholder="0" required />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Reference ID</label>
                <input type="text" value={form.reference}
                  onChange={e => setForm({ ...form, reference: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#A67B5B] transition-all text-sm font-bold placeholder:text-white/10"
                  placeholder="e.g. BATCH-A90" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Annotation</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#A67B5B] transition-all text-sm font-bold placeholder:text-white/10 resize-none"
                  placeholder="Notes for history..." rows={2} />
              </div>
              <button type="submit" disabled={submitting}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-4 ${adjustModal.type === 'IN' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {submitting ? 'Executing Command...' : adjustModal.type === 'IN' ? `Inbound Stock` : `Outbound Issue`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
