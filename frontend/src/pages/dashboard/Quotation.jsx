import React, { useState, useEffect } from 'react';
import { getQuotations, createQuotation, updateQuotationStatus, deleteQuotation, getProducts } from '../../services/api';
import { FileText, Plus, Trash2, X, RefreshCw, CheckCircle2, Clock, XCircle, IndianRupee, User, Phone, Mail, Package, Filter, ChevronRight, Hash, Receipt } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Awaiting Review', icon: Clock, cls: 'bg-amber-400/10 text-amber-400 border-amber-400/20' },
  accepted: { label: 'Formalized', icon: CheckCircle2, cls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' },
  rejected: { label: 'Draft Revoked', icon: XCircle, cls: 'bg-rose-400/10 text-rose-400 border-rose-400/20' },
};

const Quotation = () => {
  const [quotations, setQuotations] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState({ customer_name: '', customer_email: '', customer_phone: '', notes: '' });
  const [lineItems, setLineItems] = useState([{ product_id: '', name: '', price: 0, qty: 1 }]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchAll = async () => {
    try { setLoading(true); const [q, p] = await Promise.all([getQuotations(), getProducts()]); setQuotations(q); setProducts(p); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const updateLine = (idx, field, value) => {
    const lines = [...lineItems];
    lines[idx][field] = value;
    if (field === 'product_id') {
      const p = products.find(x => x.id === parseInt(value));
      if (p) { lines[idx].name = p.name; lines[idx].price = p.price; }
    }
    setLineItems(lines);
  };

  const total = lineItems.reduce((sum, l) => sum + (Number(l.price) * Number(l.qty || 1)), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createQuotation({ ...form, items: JSON.stringify(lineItems), total_amount: total });
      showToast('Proposal Dispatched'); setModal(false); fetchAll();
      setForm({ customer_name: '', customer_email: '', customer_phone: '', notes: '' });
      setLineItems([{ product_id: '', name: '', price: 0, qty: 1 }]);
    } catch (err) { showToast(err.response?.data?.error || 'Registry failed'); }
    finally { setSubmitting(false); }
  };

  const handleStatus = async (id, status) => {
    try { await updateQuotationStatus(id, status); showToast(`Proposal ${status}`); fetchAll(); if (detail?.id === id) setDetail({ ...detail, status }); }
    catch { showToast('Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Redact this proposal registry?')) return;
    try { await deleteQuotation(id); showToast('Registry Redacted'); fetchAll(); setDetail(null); }
    catch { showToast('Operation failed'); }
  };

  const filtered = filter === 'all' ? quotations : quotations.filter(q => q.status === filter);
  const fmtCurrency = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`;

  return (
    <div className="max-w-7xl mx-auto space-y-12 text-[#FFF8F0]">
      {toast && (
        <div className="fixed top-12 right-12 z-[100] flex items-center gap-4 px-6 py-4 rounded-[20px] shadow-2xl backdrop-blur-3xl border border-white/10 animate-in slide-in-from-right duration-500 bg-[#A67B5B]/80 text-[#FFF8F0]">
          <CheckCircle2 className="w-5 h-5 text-[#FFDAB9]" />
          <span className="font-bold tracking-wide text-sm">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 reveal-up">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-[1px] bg-[#A67B5B]" />
             <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FFDAB9]">Valuation Portfolio</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight">Design <span className="italic font-light text-[#FFDAB9]">Proposals</span></h1>
        </div>
        <button onClick={() => setModal(true)} className="bg-[#A67B5B] hover:bg-[#8B654A] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#A67B5B]/20 flex items-center justify-center gap-3 active:scale-95">
          <Plus className="w-4 h-4" /> Drafting New Proposal
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 reveal-up">
        {['all', 'pending', 'accepted', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${filter === f ? 'bg-[#A67B5B] text-white border-[#A67B5B] shadow-lg shadow-[#A67B5B]/20' : 'bg-white/5 text-[#FFF8F0]/40 border-white/5 hover:border-[#FFDAB9]/20 hover:text-[#FFDAB9]'}`}>
            {f === 'all' ? `Aggregate (${quotations.length})` : `${f} (${quotations.filter(q => q.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? <div className="flex flex-col justify-center items-center py-32 space-y-6"><RefreshCw className="w-12 h-12 text-[#FFDAB9] animate-spin" /><p className="text-[10px] uppercase tracking-[0.5em] text-[#FFDAB9]/40 font-black">Synthesizing Proposals</p></div>
        : filtered.length === 0 ? (
          <div className="glass-panel py-32 flex flex-col items-center text-center rounded-[60px] border-white/5 reveal-up">
            <Receipt className="w-20 h-20 text-white/5 mb-8" />
            <h3 className="font-serif text-3xl font-bold mb-3 text-[#FFDAB9]">Vault is Empty</h3>
            <p className="text-[#FFF8F0]/30 font-light max-w-sm mb-10">You have no active or archived price proposals within this filtered scope.</p>
            <button onClick={() => setModal(true)} className="bg-white/5 border border-white/10 hover:bg-white/10 text-[#FFDAB9] px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">Draft Initial Proposal</button>
          </div>
        ) : (
          <div className="glass-panel rounded-[48px] border-white/5 shadow-3xl overflow-hidden reveal-up">
            <table className="w-full">
              <thead><tr className="bg-white/2 text-[10px] uppercase tracking-[0.4em] text-[#FFDAB9]/40 font-black">
                <th className="px-10 py-8 text-left">Patron Credentials</th>
                <th className="px-6 py-8 text-left">Project Valuation</th>
                <th className="px-6 py-8 text-left">Fulfillment Status</th>
                <th className="px-6 py-8 text-left">Archival Date</th>
                <th className="px-10 py-8 text-center">Protocol</th>
              </tr></thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(q => {
                  const S = STATUS_CONFIG[q.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={q.id} className="hover:bg-white/[0.03] transition-colors cursor-pointer group" onClick={() => setDetail(q)}>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-white/2 flex items-center justify-center group-hover:bg-[#A67B5B]/10 transition-colors">
                              <User className="w-5 h-5 text-[#A67B5B]" />
                           </div>
                           <div>
                              <p className="font-serif font-bold text-lg text-[#FFF8F0] group-hover:text-[#FFDAB9] transition-colors">{q.customer_name}</p>
                              <p className="text-[10px] uppercase tracking-widest text-white/20">{q.customer_email || 'Direct Communication'}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-serif font-black text-xl text-[#A67B5B]">{fmtCurrency(q.total_amount)}</td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full border ${S.cls}`}>
                            <S.icon className="w-3 h-3" /> {S.label}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-[11px] font-bold text-white/30 tracking-tight">{new Date(q.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                      <td className="px-10 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-center gap-3">
                          {q.status === 'pending' && <>
                            <button onClick={() => handleStatus(q.id, 'accepted')} className="text-[9px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-400/20 hover:bg-emerald-400 hover:text-white px-4 py-2 rounded-xl transition-all">Formalize</button>
                            <button onClick={() => handleStatus(q.id, 'rejected')} className="text-[9px] font-black uppercase tracking-widest text-rose-400 border border-rose-400/20 hover:bg-rose-400 hover:text-white px-4 py-2 rounded-xl transition-all">Revoke</button>
                          </>}
                          <button onClick={() => handleDelete(q.id)} className="text-white/20 hover:text-rose-500 p-2.5 rounded-xl hover:bg-rose-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                          <ChevronRight className="w-5 h-5 text-white/5 group-hover:text-[#FFDAB9] group-hover:translate-x-1 transition-all" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      {/* Detail Drawer Overlay */}
      {detail && (
        <div className="fixed inset-0 z-[200] flex justify-end bg-[#2E1F13]/60 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setDetail(null)}>
          <div className="glass-panel w-full max-w-xl h-full shadow-3xl p-12 border-white/10 overflow-y-auto animate-in slide-in-from-right duration-500" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2 text-[#A67B5B]">
                   <Receipt className="w-5 h-5" />
                   <span className="text-[10px] uppercase font-black tracking-[0.5em]">Proposal Manifest</span>
                </div>
                <h2 className="font-serif text-4xl font-bold tracking-tight">Draft <span className="text-[#FFDAB9]">#{detail.id}</span></h2>
              </div>
              <button onClick={() => setDetail(null)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#FFF8F0]/30 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="glass-panel rounded-[32px] p-8 mb-10 border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#A67B5B]/5 blur-3xl" />
               <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#A67B5B] mb-6 border-b border-white/5 pb-4">Client Portfolio</p>
               <div className="space-y-6">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-white/2 flex items-center justify-center"><User className="w-5 h-5 text-[#FFDAB9]" /></div>
                   <span className="font-serif font-bold text-2xl">{detail.customer_name}</span>
                </div>
                {detail.customer_email && (
                  <div className="flex items-center gap-5 text-sm text-white/40">
                     <div className="w-12 h-12 rounded-2xl bg-white/1 flex items-center justify-center"><Mail className="w-4 h-4" /></div>
                     <span className="font-medium tracking-tight">{detail.customer_email}</span>
                  </div>
                )}
                {detail.customer_phone && (
                  <div className="flex items-center gap-5 text-sm text-white/40">
                     <div className="w-12 h-12 rounded-2xl bg-white/1 flex items-center justify-center"><Phone className="w-4 h-4" /></div>
                     <span className="font-medium tracking-tight">{detail.customer_phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel rounded-[32px] p-8 border-white/5 mb-10">
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#A67B5B] mb-8 flex items-center justify-between">
                 <span>Items & Estimations</span>
                 <Package className="w-4 h-4" />
              </p>
              <div className="space-y-6">
                {(() => { try { return JSON.parse(detail.items).map((it, i) => (
                  <div key={i} className="flex justify-between items-center group">
                    <div>
                       <p className="font-bold text-[#FFF8F0] mb-1">{it.name}</p>
                       <p className="text-[10px] text-white/20 uppercase font-black uppercase tracking-widest">Quantity: {it.qty}</p>
                    </div>
                    <span className="font-serif font-bold text-[#FFDAB9]">{fmtCurrency(it.price * it.qty)}</span>
                  </div>
                )); } catch { return <p className="text-sm text-[#FFF8F0]/50 italic">{detail.items}</p>; }})()}
              </div>
              <div className="border-t border-white/5 mt-10 pt-8 flex justify-between items-end">
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">Aggregate Valuation</span>
                <span className="text-3xl font-serif font-black text-[#A67B5B]">{fmtCurrency(detail.total_amount)}</span>
              </div>
            </div>

            {detail.status === 'pending' && (
              <div className="grid grid-cols-2 gap-6 pb-20">
                <button onClick={() => handleStatus(detail.id, 'accepted')} className="bg-[#A67B5B] hover:bg-[#8B654A] text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all active:scale-95 shadow-[#A67B5B]/10">Formalize Proposal</button>
                <button onClick={() => handleStatus(detail.id, 'rejected')} className="bg-white/5 border border-white/10 hover:bg-rose-500/80 text-[#FFF8F0] py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all active:scale-95">Revoke Draft</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Internal Drafting Modal Overlay */}
      {modal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2E1F13]/60 backdrop-blur-2xl p-6 animate-in fade-in duration-300">
          <div className="glass-panel border-white/10 shadow-3xl w-full max-w-4xl p-12 rounded-[60px] reveal-up max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="font-serif text-4xl font-bold tracking-tight">Draft New <span className="italic font-light text-[#FFDAB9]">Valuation</span></h2>
                <div className="flex items-center gap-3 mt-3 text-[#A67B5B]">
                   <FileText className="w-4 h-4" />
                   <p className="text-[10px] uppercase font-black tracking-widest italic">Proposal Construction Protocol</p>
                </div>
              </div>
              <button onClick={() => setModal(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#FFF8F0]/30 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Patron Name *</label>
                  <input value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[#FFF8F0] focus:outline-none focus:border-[#A67B5B] transition-all placeholder:text-white/10 text-sm" 
                    required placeholder="Enter client identity" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Patron Email</label>
                  <input type="email" value={form.customer_email} onChange={e => setForm({ ...form, customer_email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[#FFF8F0] focus:outline-none focus:border-[#A67B5B] transition-all placeholder:text-white/10 text-sm" 
                    placeholder="liaison@contact.com" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Patron Contact</label>
                  <input value={form.customer_phone} onChange={e => setForm({ ...form, customer_phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[#FFF8F0] focus:outline-none focus:border-[#A67B5B] transition-all placeholder:text-white/10 text-sm" 
                    placeholder="+91 000 000 0000" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Contextual Notes</label>
                <textarea 
                  value={form.notes} 
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-[#FFF8F0] focus:outline-none focus:border-[#A67B5B] transition-all placeholder:text-white/10 text-sm resize-none" 
                  placeholder="Elaborate on specific craftsmanship requirements or project nuances..."
                  rows={3}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                  <label className="text-[10px] uppercase tracking-[0.4em] text-[#A67B5B] font-black italic">Manifest Items</label>
                  <button type="button" onClick={() => setLineItems([...lineItems, { product_id: '', name: '', price: 0, qty: 1 }])}
                    className="text-[10px] font-black uppercase tracking-widest text-[#FFDAB9] hover:text-white underline transition-colors decoration-[#A67B5B] underline-offset-8">+ Document New Asset</button>
                </div>
                <div className="space-y-6">
                  {lineItems.map((line, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-6 items-end sm:items-center bg-white/[0.02] p-6 rounded-[32px] border border-white/5 group">
                      <div className="flex-1 space-y-2 w-full">
                         <label className="text-[9px] uppercase tracking-widest text-white/20 font-black ml-1">Select Piece</label>
                         <div className="relative">
                            <select value={line.product_id} onChange={e => updateLine(idx, 'product_id', e.target.value)}
                              className="w-full bg-[#2E1F13]/40 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#A67B5B] appearance-none cursor-pointer">
                              <option value="" className="bg-[#2E1F13] text-white/30">Choose from catalog...</option>
                              {products.map(p => <option key={p.id} value={p.id} className="bg-[#2E1F13]">{p.name}</option>)}
                            </select>
                            <Package className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 text-[#A67B5B] pointer-events-none" />
                         </div>
                      </div>
                      <div className="w-32 space-y-2">
                         <label className="text-[9px] uppercase tracking-widest text-white/20 font-black ml-1">Quantity</label>
                         <input type="number" min="1" value={line.qty} onChange={e => updateLine(idx, 'qty', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#A67B5B] text-center font-bold" placeholder="0" />
                      </div>
                      <div className="w-48 text-right pr-4">
                         <p className="text-[9px] uppercase tracking-widest text-white/20 font-black mb-1">Subvaluation</p>
                         <p className="font-serif font-bold text-xl text-[#FFDAB9]">{fmtCurrency(line.price * line.qty)}</p>
                      </div>
                      {lineItems.length > 1 && (
                        <button type="button" onClick={() => setLineItems(lineItems.filter((_, i) => i !== idx))} 
                          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-white/10 hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-white/5">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-12 pt-10 border-t border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-full bg-[#A67B5B]/10 flex items-center justify-center"><Receipt className="w-7 h-7 text-[#A67B5B]" /></div>
                     <div>
                        <p className="text-[10px] uppercase font-black tracking-[0.5em] text-white/20">Aggregate Proposal Valuation</p>
                        <p className="text-4xl font-serif font-black text-white">{fmtCurrency(total)}</p>
                     </div>
                  </div>
                  <button type="submit" disabled={submitting || total === 0}
                    className="bg-[#A67B5B] hover:bg-[#8B654A] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-3xl transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-4 active:scale-95 shadow-[#A67B5B]/20">
                    {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                    Confirm & Dispatch Proposal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotation;
