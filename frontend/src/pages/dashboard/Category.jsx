import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';
import { Tags, Plus, LayoutGrid, Pencil, Trash2, X, RefreshCw, CheckCircle2, Shapes } from 'lucide-react';

const ICON_STYLES = [
  'bg-[#A67B5B]/10 text-[#FFDAB9] border-[#A67B5B]/20',
  'bg-white/5 text-[#FFF8F0] border-white/10',
  'bg-[#FFDAB9]/10 text-[#A67B5B] border-[#FFDAB9]/20'
];

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchCategories = async () => {
    try { setLoading(true); setCategories(await getCategories()); } 
    catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const openAdd = () => { setForm({ name: '', description: '' }); setModal('add'); };
  const openEdit = (cat) => { setForm({ name: cat.name, description: cat.description || '' }); setModal(cat); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      setSubmitting(true);
      if (modal === 'add') { await createCategory(form); showToast('Registry Updated'); }
      else { await updateCategory(modal.id, form); showToast('Category Refined'); }
      setModal(null); fetchCategories();
    } catch (err) { showToast(err.response?.data?.error || 'System error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Redact category "${name}"?`)) return;
    try { await deleteCategory(id); showToast('Category Redacted'); fetchCategories(); }
    catch { showToast('Operation failed'); }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[#FFF8F0] focus:outline-none focus:border-[#A67B5B] transition-all placeholder:text-white/10 text-sm";

  return (
    <div className="max-w-6xl mx-auto space-y-12 text-[#FFF8F0]">
      {/* Notifications */}
      {toast && (
        <div className="fixed top-12 right-12 z-[100] flex items-center gap-4 px-6 py-4 rounded-[20px] shadow-2xl backdrop-blur-3xl border border-white/10 animate-in slide-in-from-right duration-500 bg-[#A67B5B]/80 text-[#FFF8F0]">
          <CheckCircle2 className="w-5 h-5 text-[#FFDAB9]" />
          <span className="font-bold tracking-wide text-sm">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 reveal-up">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-[1px] bg-[#A67B5B]" />
             <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FFDAB9]">Classification</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight">Design <span className="italic font-light text-[#FFDAB9]">Categories</span></h1>
        </div>
        <button onClick={openAdd} className="bg-[#A67B5B] hover:bg-[#8B654A] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#A67B5B]/20 flex items-center gap-3 active:scale-95">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-6">
          <RefreshCw className="w-12 h-12 text-[#FFDAB9] animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#FFDAB9]/40 font-black">Syncing Taxonomies</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="glass-panel py-32 flex flex-col items-center text-center rounded-[60px] border-white/5 reveal-up">
          <Shapes className="w-20 h-20 text-white/5 mb-8" />
          <h3 className="font-serif text-3xl font-bold mb-3 text-[#FFDAB9]">The Archives are Empty</h3>
          <p className="text-[#FFF8F0]/30 font-light max-w-sm mb-10">Start by defining categories to organize your masterpiece collections.</p>
          <button onClick={openAdd} className="bg-white/5 border border-white/10 hover:bg-white/10 text-[#FFDAB9] px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">Define New Category</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 reveal-up">
          {categories.map((cat, i) => (
            <div key={cat.id} className="glass-panel group rounded-[40px] border-white/5 p-8 transition-all duration-500 hover:border-[#FFDAB9]/20 hover:translate-y-[-8px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFDAB9]/5 blur-2xl pointer-events-none group-hover:bg-[#FFDAB9]/10 transition-colors" />
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500 group-hover:scale-110 ${ICON_STYLES[i % ICON_STYLES.length]}`}>
                <LayoutGrid className="w-6 h-6" />
              </div>
              
              <h3 className="font-serif font-bold text-2xl mb-3 group-hover:text-[#FFDAB9] transition-colors">{cat.name}</h3>
              <p className="text-sm text-white/40 font-light leading-relaxed mb-8 line-clamp-3">{cat.description || 'No descriptive metadata provided for this taxonomy.'}</p>
              
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <button onClick={() => openEdit(cat)} className="flex-1 bg-white/5 border border-white/10 hover:bg-[#A67B5B] hover:text-white p-3 rounded-xl transition-all flex justify-center items-center">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="flex-1 bg-white/5 border border-white/10 hover:bg-red-500/80 hover:text-white p-3 rounded-xl transition-all flex justify-center items-center">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {modal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2E1F13]/60 backdrop-blur-2xl p-6 animate-in fade-in duration-300">
          <div className="glass-panel border-white/10 shadow-3xl w-full max-w-lg p-10 rounded-[48px] reveal-up">
            <div className="flex justify-between items-start mb-10">
               <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight">{modal === 'add' ? 'New Definition' : 'Refine Category'}</h2>
                <p className="text-[10px] uppercase font-black tracking-widest text-[#A67B5B] mt-2 italic">{modal === 'add' ? 'Establish new group' : `Modifying ${modal.name}`}</p>
              </div>
              <button onClick={() => setModal(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#FFF8F0]/30 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Title *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className={inputClass} placeholder="e.g. Master Bedroom" required />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Narrative</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className={`${inputClass} resize-none`} placeholder="Descibe the aesthetic or functional scope..." rows={3} />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-[#A67B5B] hover:bg-[#8B654A] text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-4 active:scale-95 shadow-[#A67B5B]/10">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {modal === 'add' ? 'Commit to Registry' : 'Save Refinements'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
