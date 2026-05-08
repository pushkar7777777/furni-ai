import React from 'react';
import { Hammer, ShieldCheck, Heart, Sparkles, Clock, Wrench, RefreshCw, Zap } from 'lucide-react';

const Service = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-[#FFF8F0]">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Header */}
        <div className="text-center reveal-up">
          <SectionLabel text="Heritage Care" centered />
          <h1 className="text-6xl lg:text-8xl font-serif font-bold tracking-tighter">Artisan <span className="italic font-light text-[#FFDAB9]">Support.</span></h1>
          <p className="mt-8 text-[#FFF8F0]/40 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            A Saikamal piece is a lifelong commitment. Our guild of master artisans is dedicated to the preservation and refinement of your heritage furniture.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 reveal-up">
           {[
             { t: 'Texture Restoration', d: 'Master-level refinishing for timber surfaces to restore original grain vitality.', i: Sparkles },
             { i: Hammer, t: 'Structural Refinement', d: 'Precision structural audits and joint stability manifestations.' },
             { i: Heart, t: 'Upholstery Care', d: 'Deep-fabric purification and luxury leather hydration protocols.' },
             { i: ShieldCheck, t: 'Fidelity Audit', d: 'Annual health-checks for high-usage pieces to ensure legacy integrity.' },
             { i: RefreshCw, t: 'Hardware Calibration', d: 'Synchronization of silent-close hinges and mechanical components.' },
             { i: Clock, t: 'Priority Protocol', d: 'On-site artisan response within 24 cycles for premium patrons.' }
           ].map((service, i) => (
             <div key={i} className="glass-panel p-12 rounded-[56px] border-white/5 group hover:border-[#A67B5B]/30 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-[#A67B5B]/10 flex items-center justify-center text-[#FFDAB9] mb-10 group-hover:bg-[#A67B5B] group-hover:text-white transition-all">
                   <service.i className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-3xl font-bold mb-6">{service.t}</h4>
                <p className="text-[#FFF8F0]/30 font-light leading-relaxed">{service.d}</p>
             </div>
           ))}
        </div>

        {/* Contact/Support Section */}
        <div className="glass-panel rounded-[60px] p-16 border-[#A67B5B]/20 bg-[#A67B5B]/5 reveal-up text-center">
           <h2 className="text-5xl font-serif font-bold mb-8 tracking-tighter">Request an <span className="italic font-light text-[#FFDAB9]">Artisan.</span></h2>
           <p className="text-white/40 mb-12 max-w-xl mx-auto font-light leading-relaxed">Our guild is available for on-site manifestations across all major metropolitan nodes.</p>
           <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a href="mailto:info@saikamal.com?subject=Service%20request" className="bg-[#FFF8F0] text-[#2E1F13] px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:scale-105 transition-all shadow-3xl">Digital Inquiry</a>
              <a href="tel:+919876543210" className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/10 transition-all">Direct Liaison</a>
           </div>
        </div>
      </div>
    </div>
  );
};

const SectionLabel = ({ text, centered = false }) => (
  <div className={`flex items-center gap-3 mb-6 ${centered ? 'justify-center' : ''}`}>
    {!centered && <div className="w-12 h-[1px] bg-[#A67B5B]" />}
    <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-[#FFDAB9]">{text}</span>
    {centered && <div className="w-12 h-[1px] bg-[#A67B5B]" />}
  </div>
);

export default Service;
