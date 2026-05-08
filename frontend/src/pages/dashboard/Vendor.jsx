import React, { useState, useEffect } from 'react';
import { getVendors, createVendor, updateVendor, deleteVendor } from '../../services/api';
import { Building2, Plus, Phone, Mail, MapPin, Pencil, Trash2, X, RefreshCw, CheckCircle2, Tag, Search, Handshake } from 'lucide-react';

const VENDOR_TYPES = ['Wood & Timber', 'Upholstery', 'Hardware & Fittings', 'Glass & Mirrors', 'Fabrics', 'Paint & Finish', 'Logistics', 'Other'];

const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', type: '', contact: '', email: '', location: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');

  const fetchVendors = async () => {
    try { setLoading(true); setVendors(await getVendors()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVendors(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };
  const openAdd = () => { setForm({ name: '', type: '', contact: '', email: '', location: '' }); setModal('add'); };
  const openEdit = (v) => { setForm({ name: v.name, type: v.type || '', contact: v.contact || '', email: v.email || '', location: v.location || '' }); setModal(v); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (modal === 'add') { await createVendor(form); showToast('Partner Registry Updated'); }
      else { await updateVendor(modal.id, form); showToast('Partner Details Refined'); }
      setModal(null); fetchVendors();
    } catch (err) { showToast(err.response?.data?.error || 'System error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Redact partner "${name}"?`)) return;
    try { await deleteVendor(id); showToast('Partner Redacted'); fetchVendors(); }
    catch { showToast('Operation failed'); }
  };

  const filtered = vendors.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    (v.type || '').toLowerCase().includes(search.toLowerCase())
  );

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[#FFF8F0] focus:outline-none focus:border-[#A67B5B] transition-all placeholder:text-white/10 text-sm";

  return (
    <div className="max-w-7xl mx-auto space-y-12 text-[#FFF8F0]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-12 right-12 z-[100] flex items-center gap-4 px-6 py-4 rounded-[20px] shadow-2xl backdrop-blur-3xl border border-white/10 animate-in slide-in-from-right duration-500 bg-[#A67B5B]/80 text-[#FFF8F0]">
          <CheckCircle2 className="w-5 h-5 text-[#FFDAB9]" />
          <span className="font-bold tracking-wide text-sm">{toast}</span>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 reveal-up">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-[1px] bg-[#A67B5B]" />
             <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FFDAB9]">Strategic Alliances</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight">Guild <span className="italic font-light text-[#FFDAB9]">Partners</span></h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#FFDAB9] transition-colors" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Filter by name or specialty..."
              className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-[#A67B5B] focus:ring-1 focus:ring-[#A67B5B] transition-all w-full sm:w-72" 
            />
          </div>
          <button onClick={openAdd} className="bg-[#A67B5B] hover:bg-[#8B654A] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#A67B5B]/20 flex items-center justify-center gap-3 active:scale-95">
            <Plus className="w-4 h-4" /> Induct Member
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-6">
          <RefreshCw className="w-12 h-12 text-[#FFDAB9] animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#FFDAB9]/40 font-black">Decrypting Network</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel py-32 flex flex-col items-center text-center rounded-[60px] border-white/5 reveal-up">
          <Building2 className="w-20 h-20 text-white/5 mb-8" />
          <h3 className="font-serif text-3xl font-bold mb-3 text-[#FFDAB9]">{search ? 'Expansion Terminated' : 'No Affiliates Found'}</h3>
          <p className="text-[#FFF8F0]/30 font-light max-w-sm mb-10">{search ? 'The filter yielded no results within our current network.' : 'Your consortium of material and logistics partners is currently empty.'}</p>
          {!search && <button onClick={openAdd} className="bg-white/5 border border-white/10 hover:bg-white/10 text-[#FFDAB9] px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">Induct First Partner</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-up">
          {filtered.map(v => (
            <div key={v.id} className="glass-panel group rounded-[40px] border-white/5 p-10 transition-all duration-500 hover:border-[#FFDAB9]/20 hover:shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFDAB9]/5 blur-3xl pointer-events-none group-hover:bg-[#FFDAB9]/10 transition-colors" />
              
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-[#A67B5B]/10 border border-[#A67B5B]/20 rounded-2xl flex items-center justify-center text-[#FFDAB9] font-serif font-bold text-2xl group-hover:scale-110 transition-transform duration-500">
                  {v.name.charAt(0)}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                  <button onClick={() => openEdit(v)} className="p-3 rounded-xl bg-white/5 hover:bg-[#A67B5B] hover:text-white transition-all border border-white/10">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(v.id, v.name)} className="p-3 rounded-xl bg-white/5 hover:bg-red-500/80 hover:text-white transition-all border border-white/10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-serif font-bold text-2xl mb-2 group-hover:text-[#FFDAB9] transition-colors">{v.name}</h3>
              
              {v.type && (
                <div className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#FFDAB9] bg-[#A67B5B]/10 px-3.5 py-1.5 rounded-full mb-8 border border-[#A67B5B]/20">
                  <Tag className="w-3 h-3" /> {v.type}
                </div>
              )}

              <div className="space-y-4 pt-6 border-t border-white/5">
                {v.contact && (
                  <div className="flex items-center gap-4 text-sm text-white/40 hover:text-[#FFF8F0]/80 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white/2 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-[#A67B5B]" />
                    </div>
                    <span className="font-bold tracking-tight">{v.contact}</span>
                  </div>
                )}
                {v.email && (
                  <div className="flex items-center gap-4 text-sm text-white/40 hover:text-[#FFF8F0]/80 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white/2 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-[#A67B5B]" />
                    </div>
                    <span className="font-medium truncate">{v.email}</span>
                  </div>
                )}
                {v.location && (
                  <div className="flex items-center gap-4 text-sm text-white/40 hover:text-[#FFF8F0]/80 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white/2 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#A67B5B]" />
                    </div>
                    <span className="font-medium">{v.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {modal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2E1F13]/60 backdrop-blur-2xl p-6 animate-in fade-in duration-300">
          <div className="glass-panel border-white/10 shadow-3xl w-full max-w-xl p-10 rounded-[48px] reveal-up max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight">{modal === 'add' ? 'Induct Member' : 'Refine Partner'}</h2>
                <div className="flex items-center gap-3 mt-3 text-[#A67B5B]">
                   <Handshake className="w-4 h-4" />
                   <p className="text-[10px] uppercase font-black tracking-widest italic">{modal === 'add' ? 'Establish Strategic Alliance' : `Modifying ${modal.name}`}</p>
                </div>
              </div>
              <button onClick={() => setModal(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#FFF8F0]/30 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Entity Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className={inputClass} placeholder="e.g. Royal Woodcraft" required />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Member Specialty</label>
                  <div className="relative">
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                      className={`${inputClass} appearance-none bg-[#2E1F13]/40 cursor-pointer`}>
                      <option value="" className="bg-[#2E1F13] text-white/50">Select core specialty...</option>
                      {VENDOR_TYPES.map(t => <option key={t} value={t} className="bg-[#2E1F13] text-white">{t}</option>)}
                    </select>
                    <Tag className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 text-[#A67B5B] pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Comm Channel (Phone)</label>
                  <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })}
                    className={inputClass} placeholder="+91 999 000 0000" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Direct Courier (Email)</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className={inputClass} placeholder="liaison@entity.com" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Operational Bastion (Location)</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  className={inputClass} placeholder="Industrial Zone, Sector 12" />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-[#A67B5B] hover:bg-[#8B654A] text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-4 active:scale-95 shadow-[#A67B5B]/10">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Handshake className="w-4 h-4" />}
                {modal === 'add' ? 'Confirm Alliance' : 'Update Credentials'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendor;
