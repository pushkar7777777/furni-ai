import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  ChevronRight,
  Landmark,
  ShieldCheck,
  Zap,
  BarChart3,
  Download,
  FileText as LucideFileText
} from 'lucide-react';
import { getEmployees, getInventoryStats, getQuotations, downloadSalesReport } from '../../services/api';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    revenue: 1245000,
    growth: 12.5,
    employees: 0,
    lowStock: 0,
    quotations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [emp, inv, quo] = await Promise.all([
          getEmployees().catch(() => []),
          getInventoryStats().catch(() => ({})),
          getQuotations().catch(() => [])
        ]);
        setStats(prev => ({
          ...prev,
          employees: emp?.length || 0,
          lowStock: inv?.low_stock_count || 0,
          quotations: quo?.length || 0
        }));
      } catch (e) { 
        console.error("Failed to fetch dashboard stats:", e); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchStats();
  }, []);

  const userRole = localStorage.getItem('user_role') || '';
  const isAdmin = userRole === 'admin';

  const allCards = [
    { id: 'revenue', label: 'Treasury Intake', value: `₹${(stats.revenue || 0).toLocaleString('en-IN')}`, trend: '+12.5%', icon: Landmark, color: 'text-emerald-400', bg: 'bg-emerald-500/10', roles: ['admin'] },
    { id: 'employees', label: 'Guild Specialists', value: (stats.employees || 0).toString().padStart(2, '0'), trend: 'Active', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', roles: ['admin', 'inventory_manager'] },
    { id: 'stock', label: 'Inventory Depth', value: (stats.lowStock || 0).toString().padStart(2, '0'), trend: 'Critical', icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10', roles: ['admin', 'inventory_manager', 'staff'] },
    { id: 'quotations', label: 'Open Proposals', value: (stats.quotations || 0).toString().padStart(2, '0'), trend: 'Pending', icon: LucideFileText, color: 'text-amber-400', bg: 'bg-amber-500/10', roles: ['admin', 'inventory_manager', 'staff'] },
  ];

  const filteredCards = allCards.filter(card => card.roles.includes(userRole));

  const allActions = [
    { label: 'Issue Inventory', icon: Zap, to: '/dashboard/inventory', roles: ['admin', 'inventory_manager'] },
    { label: 'New Proposal', icon: LucideFileText, to: '/dashboard/quotation', roles: ['admin', 'inventory_manager', 'staff'] },
    { label: 'Export Sales', icon: Download, action: downloadSalesReport, roles: ['admin', 'inventory_manager', 'staff'] },
    { label: 'Register Artisan', icon: Users, to: '/dashboard/employee', roles: ['admin'] }
  ];

  const filteredActions = allActions.filter(act => act.roles.includes(userRole));

  // Determine grid columns safely
  const getGridCols = () => {
    const count = filteredCards.length;
    if (count >= 4) return 'lg:grid-cols-4';
    if (count === 3) return 'lg:grid-cols-3';
    if (count === 2) return 'lg:grid-cols-2';
    return 'lg:grid-cols-1';
  };

  return (
    <div className="space-y-12 pb-12 text-[#FFF8F0]">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 reveal-up">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-[1px] bg-[#A67B5B]" />
             <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FFDAB9]">Operational Overview</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight">Vanguard <span className="italic font-light text-[#FFDAB9]">Command</span></h1>
          <p className="text-white/30 text-sm mt-4 font-light tracking-wide">Welcome back to the central hub of Saikamal Furniture. Your guild operations are performing within optimal parameters.</p>
        </div>
        <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 shadow-2xl">
           <div className="w-10 h-10 rounded-xl bg-[#A67B5B]/20 flex items-center justify-center text-[#FFDAB9]">
              <ShieldCheck className="w-5 h-5" />
           </div>
           <div>
              <p className="text-[9px] uppercase font-black tracking-widest text-white/20">System Integrity</p>
              <p className="text-xs font-bold text-emerald-400">{loading ? 'SYNCING' : 'VERIFIED SECURE'}</p>
           </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${getGridCols()} gap-8 reveal-up`}>
        {filteredCards.map((card, i) => (
          <div key={card.id || i} className="glass-panel group rounded-[40px] p-8 border-white/5 relative overflow-hidden transition-all duration-500 hover:border-[#FFDAB9]/20 hover:translate-y-[-8px]">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] pointer-events-none group-hover:bg-[#FFDAB9]/5 transition-colors" />
             
             <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center ${card.color} mb-8 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                <card.icon className="w-6 h-6" />
             </div>
             
             <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20">{card.label}</p>
                <h3 className="text-3xl font-serif font-black tracking-tight">{card.value}</h3>
             </div>
             
             <div className="mt-6 flex items-center gap-2">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${card.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/40'}`}>
                   {card.trend}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-white/10 font-bold">vs last cycle</span>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 reveal-up">
         {/* Main Chart Placeholder / Visual */}
         {isAdmin && (
           <div className="lg:col-span-2 glass-panel rounded-[48px] p-10 border-white/5 flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-start mb-12">
                 <div>
                    <h3 className="font-serif text-2xl font-bold">Revenue <span className="italic font-light text-[#FFDAB9]">Manifest</span></h3>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/20 mt-1">Growth trajectory over 30 cycles</p>
                 </div>
                 <div className="flex gap-2">
                    {['W', 'M', 'Y'].map(t => <button key={t} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${t === 'M' ? 'bg-[#A67B5B] text-white' : 'text-white/20 hover:bg-white/5'}`}>{t}</button>)}
                 </div>
              </div>
              
              {/* Mock Chart Visual */}
              <div className="flex-1 min-h-[300px] flex items-end gap-3 px-4">
                 {[40, 70, 45, 90, 65, 80, 50, 100, 85, 95, 75, 110].map((h, i) => (
                    <div key={i} className="flex-1 group relative">
                       <div 
                          className="w-full bg-[#A67B5B]/20 rounded-t-xl group-hover:bg-[#A67B5B] transition-all duration-700" 
                          style={{ height: `${h}%` }}
                       />
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#FFF8F0] text-[#2E1F13] px-2 py-1 rounded text-[9px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                          ₹{(h * 1200).toLocaleString()}
                       </div>
                    </div>
                 ))}
              </div>
              
              <div className="mt-8 flex justify-between text-[9px] font-black uppercase tracking-widest text-white/10 px-4">
                 <span>Origin</span>
                 <span>Midpoint</span>
                 <span>Zenith</span>
              </div>
           </div>
         )}

         {/* Secondary Column */}
         <div className={isAdmin ? "space-y-8" : "lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 space-y-0"}>
            {/* Quick Actions */}
            <div className="glass-panel rounded-[40px] p-8 border-white/5">
               <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#FFDAB9] mb-8">Rapid Protocols</h4>
               <div className="space-y-4">
                  {filteredActions.map((act, i) => (
                     <button 
                       key={act.label || i} 
                       onClick={() => act.action ? act.action() : navigate(act.to)} 
                       className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/2 hover:bg-white/5 border border-white/5 transition-all group"
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-[#A67B5B]/10 flex items-center justify-center text-[#A67B5B] group-hover:scale-110 transition-transform">
                              <act.icon className="w-4 h-4" />
                           </div>
                           <span className="text-sm font-bold tracking-tight">{act.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-[#FFDAB9] group-hover:translate-x-1 transition-all" />
                     </button>
                  ))}
               </div>
            </div>

            {/* Performance Node */}
            <div className="glass-panel rounded-[40px] p-8 border-[#A67B5B]/20 bg-[#A67B5B]/5 relative overflow-hidden">
               <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FFDAB9]/10 blur-2xl rounded-full" />
               <BarChart3 className="w-8 h-8 text-[#FFDAB9] mb-6" />
               <h4 className="font-serif text-xl font-bold text-[#FFDAB9]">Market Synergy</h4>
               <p className="text-xs text-white/30 mt-3 leading-relaxed">Your brand presence has increased by 18% in the luxury segment this quarter. Maintain aesthetic standards.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DashboardHome;
