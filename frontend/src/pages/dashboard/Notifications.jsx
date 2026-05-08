import React, { useState, useEffect } from 'react';
import { Info, Bell, AlertTriangle, CheckCircle2, Package, FileText, Settings, X, RefreshCw } from 'lucide-react';
import { getAlerts, clearAlerts } from '../../services/api';

const Notifications = () => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const data = await getAlerts();
      
      // Transform backend data to UI format
      const transformed = data.map(n => ({
        id: n.id,
        type: n.type === 'stock' ? 'alert' : 'info',
        title: n.type === 'stock' ? 'Inventory Alert' : 'System Notice',
        message: n.type === 'stock' ? `Product #${n.product_id} has reached critical stock levels.` : 'General system notification.',
        time: new Date(n.created_at).toLocaleTimeString(),
        icon: n.type === 'stock' ? AlertTriangle : Info,
        color: n.type === 'stock' ? 'text-rose-400' : 'text-[#FFDAB9]'
      }));
      
      setNotifs(transformed);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifs(); }, []);

  const handleClear = async () => {
    try {
      await clearAlerts();
      setNotifs([]);
    } catch (e) { console.error(e); }
  };

  const removeNotif = (id) => setNotifs(notifs.filter(n => n.id !== id));

  return (
    <div className="max-w-4xl mx-auto space-y-12 text-[#FFF8F0]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 reveal-up">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-[1px] bg-[#A67B5B]" />
             <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FFDAB9]">Intelligence Feed</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight">System <span className="italic font-light text-[#FFDAB9]">Oversight</span></h1>
        </div>
        <button onClick={handleClear} className="text-[10px] uppercase font-black tracking-widest text-white/20 hover:text-white transition-colors">Clear All Chronicles</button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-6">
          <RefreshCw className="w-12 h-12 text-[#FFDAB9] animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#FFDAB9]/40 font-black">Syncing Intel</p>
        </div>
      ) : notifs.length === 0 ? (
        <div className="glass-panel py-32 flex flex-col items-center text-center rounded-[60px] border-white/5 reveal-up">
          <Bell className="w-20 h-20 text-white/5 mb-8" />
          <h3 className="font-serif text-3xl font-bold mb-3 text-[#FFDAB9]">The Void is Silent</h3>
          <p className="text-[#FFF8F0]/30 font-light max-w-sm mb-10">You have no active notifications or critical alerts at this moment. Everything is operating within normal parameters.</p>
          <button onClick={fetchNotifs} className="bg-white/5 border border-white/10 hover:bg-white/10 text-[#FFDAB9] px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3">
             <RefreshCw className="w-4 h-4" /> Re-sync Node
          </button>
        </div>
      ) : (
        <div className="space-y-6 reveal-up">
          {notifs.map((n) => (
            <div key={n.id} className="glass-panel group rounded-[32px] border-white/5 p-8 flex items-start gap-8 transition-all duration-500 hover:border-[#FFDAB9]/20 hover:translate-x-2 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-full bg-white/[0.01] pointer-events-none" />
               
               <div className={`w-16 h-16 shrink-0 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-2xl ${n.color}`}>
                  <n.icon className="w-7 h-7" />
               </div>

               <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center justify-between mb-2">
                     <h3 className="font-serif font-bold text-xl group-hover:text-[#FFDAB9] transition-colors">{n.title}</h3>
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">{n.time}</span>
                  </div>
                  <p className="text-white/40 leading-relaxed font-light text-sm max-w-2xl">{n.message}</p>
               </div>

               <button 
                onClick={() => removeNotif(n.id)}
                className="absolute top-8 right-8 text-white/10 hover:text-rose-400 transition-colors"
               >
                  <X className="w-5 h-5" />
               </button>
            </div>
          ))}
        </div>
      )}

      <div className="pt-12 text-center reveal-up">
         <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/10">Historical archives are maintained for 30 cycles</p>
      </div>
    </div>
  );
};

export default Notifications;
