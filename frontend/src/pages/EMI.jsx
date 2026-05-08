import React from 'react';
import { Landmark, Calendar, ShieldCheck, ArrowRight, Zap, PiggyBank, Receipt, Handshake } from 'lucide-react';

const EMI = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-[#FFF8F0]">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Header */}
        <div className="text-center reveal-up">
          <div className="flex items-center justify-center gap-3 mb-6">
             <div className="w-12 h-[1px] bg-[#A67B5B]" />
             <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-[#FFDAB9]">Financial Synergy</span>
             <div className="w-12 h-[1px] bg-[#A67B5B]" />
          </div>
          <h1 className="text-6xl lg:text-8xl font-serif font-bold tracking-tighter">Ownership <span className="italic font-light text-[#FFDAB9]">Simplified.</span></h1>
          <p className="mt-8 text-[#FFF8F0]/40 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Acquire heritage pieces through our flexible acquisition plans. Premium furniture, attainable through intelligent financial orchestration.
          </p>
        </div>

        {/* Featured Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 reveal-up">
          {[
            { t: 'The Foundation Plan', d: '0% Interest for 12 cycles. 30% Initial intake.', i: PiggyBank, c: 'bg-emerald-500/10 text-emerald-400' },
            { t: 'Artisan Installments', d: 'Flexible 24-cycle manifest. Nominal protocol fee.', i: Calendar, c: 'bg-[#A67B5B]/10 text-[#FFDAB9]' },
            { t: 'Legacy Leasing', d: 'Acquire now, decide later. Fractional monthly intake.', i: Handshake, c: 'bg-blue-500/10 text-blue-400' }
          ].map((plan, i) => (
            <div key={i} className="glass-panel p-12 rounded-[56px] border-white/5 hover:border-[#A67B5B]/20 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] pointer-events-none group-hover:bg-[#A67B5B]/5 transition-colors" />
               <div className={`w-16 h-16 rounded-2xl ${plan.c} flex items-center justify-center mb-10 border border-white/5`}>
                  <plan.i className="w-8 h-8" />
               </div>
               <h3 className="text-3xl font-serif font-bold mb-6">{plan.t}</h3>
               <p className="text-[#FFF8F0]/30 font-light leading-relaxed mb-12">{plan.d}</p>
               <a href="mailto:info@saikamal.com?subject=EMI%20plan%20inquiry" className="flex items-center gap-4 text-[10px] uppercase font-black tracking-widest text-[#FFDAB9] hover:gap-6 transition-all">
                  Inquire Protocol <ArrowRight className="w-4 h-4" />
               </a>
            </div>
          ))}
        </div>

        {/* Calculator Visual Placeholder */}
        <div className="glass-panel rounded-[60px] p-16 lg:p-24 border-[#A67B5B]/20 bg-[#A67B5B]/5 reveal-up overflow-hidden relative">
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FFDAB9]/5 blur-[120px]" />
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
              <div>
                 <h2 className="text-5xl font-serif font-bold mb-8 tracking-tighter">Synergy <span className="italic font-light text-[#FFDAB9]">Calculator.</span></h2>
                 <p className="text-white/40 mb-12 font-light leading-relaxed">Simulate your acquisition path. Our algorithms calculate the optimal monthly intake based on your chosen piece's manifest value.</p>
                 <div className="space-y-8">
                    <div className="h-2 w-full bg-white/5 rounded-full relative">
                       <div className="absolute top-0 left-0 h-full w-2/3 bg-[#A67B5B] rounded-full shadow-[0_0_20px_rgba(166,123,91,0.5)]" />
                    </div>
                    <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-white/20">
                       <span>Initial: ₹15,000</span>
                       <span>Final: ₹1,50,000</span>
                    </div>
                 </div>
              </div>
              <div className="bg-[#1d120c] rounded-[40px] p-12 border border-white/5 shadow-3xl">
                 <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#A67B5B]/20 flex items-center justify-center text-[#FFDAB9]">
                       <Receipt className="w-7 h-7" />
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-black tracking-widest text-white/20">Estimated Intake</p>
                       <p className="text-4xl font-serif font-bold">₹4,250 <span className="text-sm font-light text-white/30 italic">/cycle</span></p>
                    </div>
                 </div>
                 <a href="mailto:info@saikamal.com?subject=EMI%20application%20verification" className="block w-full bg-[#FFF8F0] text-[#2E1F13] py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:scale-[1.02] transition-all active:scale-95 text-center">Verify Application</a>
              </div>
           </div>
        </div>

        {/* Requirements */}
        <div className="max-w-4xl mx-auto reveal-up">
           <h3 className="text-center font-serif text-3xl font-bold mb-16">Acquisition <span className="italic font-light text-[#FFDAB9]">Criteria.</span></h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                'Valid Government Identification (Aadhar/PAN)',
                'Proof of Professional Sustenance (Income)',
                'Patron Residence Verification',
                'Last 6 months Bank Manifest'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 group">
                   <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400 group-hover:text-white transition-all">
                      <ShieldCheck className="w-5 h-5" />
                   </div>
                   <span className="text-lg font-light tracking-tight">{item}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default EMI;
