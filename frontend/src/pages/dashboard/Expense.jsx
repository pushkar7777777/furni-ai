import React, { useState, useEffect } from 'react';
import { getExpenses, createExpense, deleteExpense, getExpenseStats } from '../../services/api';
import { Plus, IndianRupee, Landmark, Calendar, Tag, CheckCircle2, History, RefreshCw, X, TrendingUp, Wallet, Trash2 } from 'lucide-react';

const StatCard = ({ label, value, icon, color }) => (
  <div className="glass-panel rounded-[32px] p-8 flex flex-col gap-6 border-white/5 hover:border-[#FFDAB9]/20 transition-all group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 ${color} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-[0.4em] text-[#FFDAB9]/40 font-black mb-2">{label}</p>
      <p className="text-3xl font-serif font-bold text-[#FFF8F0]">₹{Number(value || 0).toLocaleString('en-IN')}</p>
    </div>
  </div>
);

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({ category: '', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [exData, stData] = await Promise.all([
        getExpenses(),
        getExpenseStats()
      ]);
      setExpenses(exData);
      setStats(stData);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;
    try {
      setSubmitting(true);
      await createExpense(formData);
      showToast('Disbursement Logged');
      setAdding(false);
      setFormData({ category: '', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
      fetchAll();
    } catch { showToast('Filing failed'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Redact this transaction from the records?')) return;
    try {
      await deleteExpense(id);
      showToast('Record Redacted');
      fetchAll();
    } catch { showToast('Operation failed'); }
  };

  const totalSpent = stats.reduce((acc, curr) => acc + Number(curr.total), 0);

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-[#FFF8F0] focus:outline-none focus:border-[#A67B5B] transition-all placeholder:text-white/10 text-sm";

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
             <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FFDAB9]">Treasury Ledger</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight">Expenditure <span className="italic font-light text-[#FFDAB9]">Tracking</span></h1>
        </div>
        <div className="flex gap-4">
          <button onClick={fetchAll} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFDAB9] hover:bg-white/10 transition-all">
             <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setAdding(!adding)}
            className="bg-[#A67B5B] hover:bg-[#8B654A] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#A67B5B]/20 flex items-center justify-center gap-3 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Log New Disbursement
          </button>
        </div>
      </div>

      {loading && expenses.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-6">
          <RefreshCw className="w-12 h-12 text-[#FFDAB9] animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#FFDAB9]/40 font-black">Auditing Treasury</p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 reveal-up">
            <StatCard label="Total Disbursement" value={totalSpent} icon={<Wallet className="w-7 h-7 text-emerald-400" />} />
            {stats.slice(0, 3).map((s, i) => (
              <StatCard key={i} label={`${s.category} Allocation`} value={s.total} icon={<TrendingUp className="w-7 h-7 text-[#FFDAB9]" />} />
            ))}
          </div>

          {adding && (
            <div className="glass-panel p-10 rounded-[48px] border-white/5 reveal-up relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFDAB9]/5 blur-3xl pointer-events-none" />
              <div className="flex justify-between items-start mb-10">
                <h3 className="font-serif text-2xl font-bold flex items-center gap-3">
                   <Landmark className="w-6 h-6 text-[#A67B5B]" />
                   Record Transaction
                </h3>
                <button onClick={() => setAdding(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Classification *</label>
                    <div className="relative">
                      <select 
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className={`${inputClass} appearance-none bg-[#2E1F13]/40 cursor-pointer`}
                        required
                      >
                        <option value="" className="bg-[#2E1F13] text-white/50">Select Category...</option>
                        <option value="Raw Material" className="bg-[#2E1F13]">Raw Material</option>
                        <option value="Logistics" className="bg-[#2E1F13]">Logistics</option>
                        <option value="Utility" className="bg-[#2E1F13]">Utility</option>
                        <option value="Maintenance" className="bg-[#2E1F13]">Maintenance</option>
                        <option value="Salaries" className="bg-[#2E1F13]">Salaries</option>
                        <option value="Marketing" className="bg-[#2E1F13]">Marketing</option>
                      </select>
                      <Tag className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 text-[#A67B5B] pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Narrative</label>
                    <input 
                      type="text" 
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className={inputClass}
                      placeholder="e.g. Exotic Veneer Batch"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Disbursement Date *</label>
                    <input 
                      type="date" 
                      value={formData.date} 
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Value (₹) *</label>
                    <div className="relative">
                      <IndianRupee className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-[#A67B5B]" />
                      <input 
                        type="number" 
                        value={formData.amount} 
                        onChange={e => setFormData({...formData, amount: e.target.value})}
                        className={`${inputClass} pl-12 font-serif font-bold text-lg`}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button type="submit" disabled={submitting} className="bg-[#A67B5B] hover:bg-[#8B654A] text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-[#A67B5B]/10 active:scale-95 disabled:opacity-50 flex items-center gap-3">
                    {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Landmark className="w-4 h-4" />}
                    Commit to Ledger
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Expense List Table */}
          <div className="glass-panel rounded-[48px] border-white/5 shadow-3xl overflow-hidden reveal-up">
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                   <History className="w-6 h-6 text-[#FFDAB9]" />
                   <h2 className="font-serif text-2xl font-bold">Transaction Chronicles</h2>
                </div>
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/20">Archiving {expenses.length} Records</span>
            </div>
            
            {expenses.length === 0 ? (
              <div className="py-24 text-center">
                 <Landmark className="w-16 h-16 mx-auto mb-6 opacity-5" />
                 <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/20">The Treasury Archives are Empty</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/2 text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black">
                      <th className="px-10 py-6">Filing Date</th>
                      <th className="px-6 py-6 font-black">Category</th>
                      <th className="px-6 py-6 font-black">Narrative</th>
                      <th className="px-6 py-6 font-black text-right">Magnitude</th>
                      <th className="px-10 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-3">
                              <Calendar className="w-3.5 h-3.5 text-[#A67B5B]" />
                              <span className="text-sm font-medium text-white/60">{new Date(expense.date).toLocaleDateString('en-GB')}</span>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FFDAB9] bg-[#A67B5B]/10 px-3 py-1.5 rounded-full border border-[#A67B5B]/20">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <p className="text-base font-bold text-[#FFF8F0] group-hover:text-[#FFDAB9] transition-colors">{expense.description || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-6 text-right text-lg font-serif font-bold text-[#FFDAB9]">
                          ₹{Number(expense.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button onClick={() => handleDelete(expense.id)} className="text-white/5 hover:text-rose-500 p-2 transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Expense;
