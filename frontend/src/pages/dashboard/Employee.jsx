import React, { useState, useEffect } from 'react';
import { getEmployees, createEmployee, deleteEmployee, updateEmployee } from '../../services/api';
import { UsersRound, Briefcase, ShieldCheck, Mail, Phone, UserPlus, RefreshCw, X, CheckCircle2, Trash2, Pencil } from 'lucide-react';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', email: '', phone: '', status: 'Active', join_date: new Date().toISOString().split('T')[0] });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const resetForm = () => {
    setForm({ name: '', role: '', email: '', phone: '', status: 'Active', join_date: new Date().toISOString().split('T')[0] });
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setModal(true);
  };

  const openEdit = (member) => {
    setEditingId(member.id);
    setForm({
      name: member.name || '',
      role: member.role || '',
      email: member.email || '',
      phone: member.phone || '',
      status: member.status || 'Active',
      join_date: member.join_date ? new Date(member.join_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        await updateEmployee(editingId, form);
        showToast('Specialist Updated');
      } else {
        await createEmployee(form);
        showToast('Specialist Inducted');
      }
      setModal(false);
      resetForm();
      fetchAll();
    } catch (err) { showToast(err.response?.data?.error || 'Operation failed'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Redact this specialist from the guild?')) return;
    try {
      await deleteEmployee(id);
      showToast('Specialist Redacted');
      fetchAll();
    } catch { showToast('Operation failed'); }
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className="max-w-7xl mx-auto space-y-12 text-[#FFF8F0]">
      {toast && (
        <div className="fixed top-12 right-12 z-[100] flex items-center gap-4 px-6 py-4 rounded-[20px] shadow-2xl backdrop-blur-3xl border border-white/10 animate-in slide-in-from-right duration-500 bg-[#A67B5B]/80 text-[#FFF8F0]">
          <CheckCircle2 className="w-5 h-5 text-[#FFDAB9]" />
          <span className="font-bold tracking-wide text-sm">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 reveal-up">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-[1px] bg-[#A67B5B]" />
             <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FFDAB9]">Council & Artisans</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight">Guild <span className="italic font-light text-[#FFDAB9]">Directory</span></h1>
        </div>
        <button onClick={openCreate} className="bg-[#A67B5B] hover:bg-[#8B654A] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#A67B5B]/20 flex items-center justify-center gap-3 active:scale-95">
          <UserPlus className="w-5 h-5" />
          Induct Specialist
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-6">
          <RefreshCw className="w-12 h-12 text-[#FFDAB9] animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#FFDAB9]/40 font-black">Synthesizing Personnel</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="glass-panel py-32 flex flex-col items-center text-center rounded-[60px] border-white/5 reveal-up">
          <UsersRound className="w-20 h-20 text-white/5 mb-8" />
          <h3 className="font-serif text-3xl font-bold mb-3 text-[#FFDAB9]">Consortium is Empty</h3>
          <p className="text-[#FFF8F0]/30 font-light max-w-sm mb-10">No specialists have been inducted into the guild registry yet.</p>
          <button onClick={openCreate} className="bg-white/5 border border-white/10 hover:bg-white/10 text-[#FFDAB9] px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">Induct Initial Specialist</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 reveal-up">
          {employees.map((member) => (
            <div key={member.id} className="glass-panel group rounded-[40px] border-white/5 p-10 flex flex-col items-center transition-all duration-500 hover:border-[#FFDAB9]/20 hover:translate-y-[-8px] relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFDAB9]/5 blur-3xl pointer-events-none group-hover:bg-[#FFDAB9]/10 transition-colors" />
              
              <div className="w-full flex justify-between mb-2">
                <button onClick={() => handleDelete(member.id)} className="text-white/5 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                <button onClick={() => openEdit(member)} className="text-white/10 hover:text-[#FFDAB9] transition-colors"><Pencil className="w-5 h-5" /></button>
              </div>
              
              <div className={`w-28 h-28 bg-[#A67B5B]/20 rounded-full mb-6 border-4 border-white/5 flex items-center justify-center font-serif font-bold text-4xl text-[#FFDAB9] group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                {getInitial(member.name)}
              </div>
              
              <h3 className="text-2xl font-serif font-bold mb-2 group-hover:text-[#FFDAB9] transition-colors">{member.name}</h3>
              
              <div className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#FFDAB9] bg-[#A67B5B]/10 px-4 py-1.5 rounded-full mb-8 border border-[#A67B5B]/20">
                 <Briefcase className="w-3 h-3" /> {member.role}
              </div>
              
              <div className="w-full pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
                 <div className="space-y-1">
                   <div className="text-[8px] text-white/20 font-black uppercase tracking-[0.2em]">Affiliation</div>
                   <div className="font-bold text-xs tracking-tight">{member.join_date ? new Date(member.join_date).toLocaleDateString() : 'N/A'}</div>
                 </div>
                 <div className="space-y-1">
                   <div className="text-[8px] text-white/20 font-black uppercase tracking-[0.2em]">Directive</div>
                   <div className={`font-bold text-xs tracking-tight ${member.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {member.status}
                   </div>
                 </div>
              </div>

              <div className="mt-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                 {member.email && <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#A67B5B] transition-all border border-white/5"><Mail className="w-4 h-4" /></button>}
                 {member.phone && <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#A67B5B] transition-all border border-white/5"><Phone className="w-4 h-4" /></button>}
                 <button onClick={() => openEdit(member)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#A67B5B] transition-all border border-white/5"><ShieldCheck className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Induction Modal */}
      {modal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2E1F13]/60 backdrop-blur-2xl p-6 animate-in fade-in duration-300">
          <div className="glass-panel border-white/10 shadow-3xl w-full max-w-lg p-10 rounded-[48px] reveal-up">
            <div className="flex justify-between items-start mb-10">
               <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight">{editingId ? 'Update Specialist' : 'Induct Specialist'}</h2>
                <p className="text-[10px] uppercase font-black tracking-widest text-[#A67B5B] mt-2 italic">{editingId ? 'Maintaining Staff Credentials' : 'Establishing New Credentials'}</p>
              </div>
              <button onClick={() => { setModal(false); resetForm(); }} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#FFF8F0]/30 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Specialist Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[#FFF8F0] focus:outline-none focus:border-[#A67B5B] placeholder:text-white/10" placeholder="Full legal identity" required />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Artisan Role *</label>
                <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[#FFF8F0] focus:outline-none focus:border-[#A67B5B] placeholder:text-white/10" placeholder="e.g. Master Teak Specialist" required />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                   <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Email</label>
                   <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[#FFF8F0] focus:outline-none focus:border-[#A67B5B]" placeholder="liana@furni.ai" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Phone</label>
                   <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[#FFF8F0] focus:outline-none focus:border-[#A67B5B]" placeholder="+91" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-[#2E1F13] border border-white/10 rounded-2xl px-5 py-4 text-[#FFF8F0] focus:outline-none focus:border-[#A67B5B]">
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Terminated</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Join Date</label>
                  <input type="date" value={form.join_date} onChange={e => setForm({ ...form, join_date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[#FFF8F0] focus:outline-none focus:border-[#A67B5B]" />
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-[#A67B5B] hover:bg-[#8B654A] text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-4 active:scale-95 shadow-[#A67B5B]/10">
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {editingId ? 'Save Specialist' : 'Confirm Induction'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
