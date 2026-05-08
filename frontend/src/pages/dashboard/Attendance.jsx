import React, { useState, useEffect } from 'react';
import { getAttendance, logAttendance, getEmployees, checkOut } from '../../services/api';
import { CalendarCheck, Calendar, Clock, UserCheck, ShieldCheck, AlertCircle, History, Filter, RefreshCw, CheckCircle2, X } from 'lucide-react';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [empData, attData] = await Promise.all([
        getEmployees(),
        getAttendance(selectedDate)
      ]);
      setEmployees(empData);
      setAttendance(attData);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [selectedDate]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const handleLog = async (employeeId, status) => {
    try {
      setSubmitting(true);
      await logAttendance({
        employee_id: employeeId,
        date: selectedDate,
        status: status,
        check_in: ['Present', 'Late'].includes(status) ? new Date().toLocaleTimeString('en-GB', { hour12: false }) : null
      });
      showToast('Attendance Protocol Logged');
      fetchAll();
    } catch { showToast('Operation failed'); }
    finally { setSubmitting(false); }
  };

  const handleCheckOut = async (employeeId) => {
    try {
      setSubmitting(true);
      await checkOut({ employee_id: employeeId });
      showToast('Check-out Recorded');
      fetchAll();
    } catch (e) { showToast(e.response?.data?.error || 'Check-out failed'); }
    finally { setSubmitting(false); }
  };

  const getStatus = (empId) => {
    const entry = attendance.find(a => a.employee_id === empId);
    return entry ? entry.status : 'Unmarked';
  };

  const getTime = (empId) => {
    const entry = attendance.find(a => a.employee_id === empId);
    return entry ? entry.check_in : '--:--';
  };

  const stats = [
    { label: 'Artisans Present', value: `${attendance.filter(a => a.status === 'Present').length} / ${employees.length}`, icon: UserCheck, color: 'text-emerald-400' },
    { label: 'Late Arrivals', value: String(attendance.filter(a => a.status === 'Late').length).padStart(2, '0'), icon: Clock, color: 'text-amber-400' },
    { label: 'Absent Registry', value: String(attendance.filter(a => a.status === 'Absent').length).padStart(2, '0'), icon: X, color: 'text-rose-400' },
    { label: 'Validation Protocol', value: 'Active', icon: ShieldCheck, color: 'text-[#FFDAB9]' },
  ];

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
             <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FFDAB9]">Staff Surveillance</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight">Chronicle <span className="italic font-light text-[#FFDAB9]">Registry</span></h1>
        </div>
        
        <div className="flex gap-4">
           <div className="relative group">
             <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A67B5B]" />
             <input 
               type="date" 
               value={selectedDate} 
               onChange={e => setSelectedDate(e.target.value)}
               className="bg-white/5 border border-white/10 text-[#FFDAB9] pl-12 pr-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-[#A67B5B] transition-all cursor-pointer"
             />
           </div>
           <button onClick={fetchAll} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFDAB9] hover:bg-white/10 transition-all">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-6">
          <RefreshCw className="w-12 h-12 text-[#FFDAB9] animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#FFDAB9]/40 font-black">Syncing Chronometer</p>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 reveal-up">
             {stats.map((stat, i) => (
               <div key={i} className="glass-panel rounded-[32px] p-8 border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] blur-2xl group-hover:bg-[#FFDAB9]/5 transition-colors" />
                  <stat.icon className={`w-8 h-8 ${stat.color} mb-6`} />
                  <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20 mb-2">{stat.label}</p>
                  <h3 className="text-3xl font-serif font-black">{stat.value}</h3>
               </div>
             ))}
          </div>

          {/* Attendance Log Table */}
          <div className="glass-panel rounded-[48px] border-white/5 shadow-3xl overflow-hidden reveal-up">
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                   <History className="w-6 h-6 text-[#FFDAB9]" />
                   <h2 className="font-serif text-2xl font-bold">Consortium Attendance <span className="text-white/20 italic font-light ml-2">{new Date(selectedDate).toDateString()}</span></h2>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40">
                   <Filter className="w-3 h-3" /> Filter Log
                </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/2 text-[10px] uppercase tracking-[0.4em] text-[#FFDAB9]/40 font-black">
                    <th className="px-10 py-8">Subject Identity</th>
                    <th className="px-6 py-8">Timestamp</th>
                    <th className="px-6 py-8">Protocol Status</th>
                    <th className="px-10 py-8 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {employees.map((member) => (
                    <tr key={member.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-[#A67B5B]/10 flex items-center justify-center text-[#FFDAB9] font-bold text-sm">
                              {member.name.charAt(0)}
                           </div>
                           <div>
                             <p className="font-serif font-bold text-lg text-[#FFF8F0] group-hover:text-[#FFDAB9] transition-colors">{member.name}</p>
                             <p className="text-[9px] uppercase tracking-widest text-[#A67B5B] font-bold">{member.role}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-mono text-sm text-white/40 tracking-widest">{getTime(member.id)}</td>
                      <td className="px-6 py-6">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border ${
                          getStatus(member.id) === 'Late' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                          getStatus(member.id) === 'Absent' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          getStatus(member.id) === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          'bg-white/5 text-white/20 border-white/10'
                        }`}>
                          {getStatus(member.id)}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        {selectedDate === new Date().toISOString().split('T')[0] && (
                          <div className="flex justify-end gap-2">
                             <button onClick={() => handleLog(member.id, 'Present')} disabled={submitting} 
                               className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">Present</button>
                             <button onClick={() => handleLog(member.id, 'Late')} disabled={submitting}
                               className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/10 hover:bg-amber-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">Late</button>
                             <button onClick={() => handleLog(member.id, 'Absent')} disabled={submitting}
                               className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">Absent</button>
                             <button onClick={() => handleLog(member.id, 'Leave')} disabled={submitting}
                               className="px-4 py-2 rounded-xl bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">Leave</button>
                             {getStatus(member.id) !== 'Unmarked' && getStatus(member.id) !== 'Absent' && (
                               <button onClick={() => handleCheckOut(member.id)} disabled={submitting}
                                className="px-4 py-2 rounded-xl bg-[#A67B5B]/10 text-[#FFDAB9] border border-[#A67B5B]/20 hover:bg-[#A67B5B] hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">Out</button>
                             )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="glass-panel p-10 rounded-[40px] border-[#A67B5B]/20 bg-[#A67B5B]/5 reveal-up flex flex-col md:flex-row items-center gap-8 justify-between">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#A67B5B]/10 flex items-center justify-center text-[#A67B5B]">
               <AlertCircle className="w-8 h-8" />
            </div>
            <div>
               <h4 className="font-serif text-xl font-bold text-[#FFDAB9]">Operational Integrity Notice</h4>
               <p className="text-white/30 text-sm mt-1">Manual overrides for historical logs are tracked. All biometric entries remain immutable in the legacy vault.</p>
            </div>
         </div>
         <button onClick={() => fetchAll()} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5">Refresh Protocol</button>
      </div>
    </div>
  );
};

export default Attendance;
