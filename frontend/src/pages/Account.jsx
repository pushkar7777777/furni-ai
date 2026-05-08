import React, { useEffect, useState } from "react";
import { Save, User, MapPin, Phone, ShieldCheck, Mail, RefreshCw } from "lucide-react";
import { getMyProfile, updateMyProfile } from "../services/api";
import { useToast } from "../context/ToastContext";

const defaultForm = {
  name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: ""
};

const Account = () => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const userRole = localStorage.getItem('user_role') || 'Customer';
  const userEmail = localStorage.getItem('user_email') || 'patron@furniai.com';

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          address_line1: data.address_line1 || "",
          address_line2: data.address_line2 || "",
          city: data.city || "",
          state: data.state || "",
          postal_code: data.postal_code || ""
        });
      } catch (error) {
        addToast({ variant: "error", message: error?.response?.data?.message || "Unable to load your profile." });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [addToast]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const updated = await updateMyProfile(form);
      localStorage.setItem("user_name", updated.name || "");
      addToast({ variant: "success", message: "Profile updated successfully." });
    } catch (error) {
      addToast({ variant: "error", message: error?.response?.data?.message || "Unable to update your profile." });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-2xl border border-white/10 bg-[#1d120c]/70 px-4 py-3.5 text-[#FFF8F0] outline-none focus:border-[#A67B5B]/50 transition-all placeholder:text-white/10";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 animate-spin text-[#FFDAB9]" />
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#FFDAB9]/40 font-black">Syncing Credentials</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mb-12 reveal-up">
        <div className="flex items-center gap-3 mb-4">
           <div className="w-12 h-[1px] bg-[#A67B5B]" />
           <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#FFDAB9]">Profile Management</span>
        </div>
        <h1 className="font-serif text-5xl font-bold text-[#FFF8F0]">Specialist <span className="italic font-light text-[#FFDAB9]">Command</span></h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Sidebar */}
        <aside className="lg:col-span-1 space-y-8 reveal-up">
           <div className="glass-panel rounded-[40px] p-10 border-white/5 relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFDAB9]/5 blur-3xl pointer-events-none" />
              <div className="w-24 h-24 bg-[#A67B5B]/20 rounded-full mx-auto mb-6 border-4 border-white/5 flex items-center justify-center font-serif font-bold text-4xl text-[#FFDAB9]">
                {form.name ? form.name.charAt(0).toUpperCase() : '?'}
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#FFF8F0] mb-2">{form.name || 'Anonymous Artisan'}</h2>
              <div className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#FFDAB9] bg-[#A67B5B]/10 px-4 py-1.5 rounded-full mb-6 border border-[#A67B5B]/20">
                 <ShieldCheck className="w-3 h-3" /> {userRole.replace('_', ' ')}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-white/30">
                 <Mail className="w-4 h-4" />
                 <span>{userEmail}</span>
              </div>
           </div>

           <div className="glass-panel rounded-[32px] p-8 border-[#A67B5B]/20 bg-[#A67B5B]/5">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#FFDAB9] mb-4">System Notice</h4>
              <p className="text-xs text-white/30 leading-relaxed">Ensure your contact information is accurate for delivery fulfillment and guild communications.</p>
           </div>
        </aside>

        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-8 reveal-up" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="glass-panel rounded-[40px] border-white/5 p-10 shadow-3xl shadow-black/20">
              <div className="flex items-center gap-4 mb-8">
                 <User className="w-6 h-6 text-[#A67B5B]" />
                 <h2 className="text-xl font-serif font-bold text-[#FFF8F0]">Identity & Contact</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Full Identity</label>
                  <input 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    className={inputClass}
                    placeholder="Artisan Name"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Communication Node (Phone)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A67B5B]" />
                    <input 
                      value={form.phone} 
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                      className={`${inputClass} pl-12`}
                      placeholder="+91"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-[40px] border-white/5 p-10 shadow-3xl shadow-black/20">
              <div className="flex items-center gap-4 mb-8">
                 <MapPin className="w-6 h-6 text-[#A67B5B]" />
                 <h2 className="text-xl font-serif font-bold text-[#FFF8F0]">Location Manifest</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Primary Residence / Workshop</label>
                  <input 
                    value={form.address_line1} 
                    onChange={(e) => setForm({ ...form, address_line1: e.target.value })} 
                    className={inputClass}
                    placeholder="Building, Street, Area"
                  />
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Secondary Manifest (Optional)</label>
                  <input 
                    value={form.address_line2} 
                    onChange={(e) => setForm({ ...form, address_line2: e.target.value })} 
                    className={inputClass}
                    placeholder="Floor, Landmark, etc."
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Sector (City)</label>
                  <input 
                    value={form.city} 
                    onChange={(e) => setForm({ ...form, city: e.target.value })} 
                    className={inputClass}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Province (State)</label>
                  <input 
                    value={form.state} 
                    onChange={(e) => setForm({ ...form, state: e.target.value })} 
                    className={inputClass}
                    placeholder="State"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-[#FFDAB9]/40 font-black ml-1">Postal Code</label>
                  <input 
                    value={form.postal_code} 
                    onChange={(e) => setForm({ ...form, postal_code: e.target.value })} 
                    className={inputClass}
                    placeholder="6-digit code"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                disabled={saving} 
                className="inline-flex items-center gap-3 rounded-2xl bg-[#A67B5B] hover:bg-[#8B654A] px-10 py-5 font-black uppercase tracking-[0.3em] text-[10px] text-[#FFF8F0] transition shadow-2xl shadow-[#A67B5B]/20 active:scale-95 disabled:opacity-50"
              >
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Archiving..." : "Commit Refinements"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
