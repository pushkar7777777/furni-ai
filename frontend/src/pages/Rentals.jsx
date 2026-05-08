import React from 'react';
import { Sofa, Key, Clock, ArrowRight, ShieldCheck, Zap, Warehouse, Coins } from 'lucide-react';

const Rentals = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-[#FFF8F0]">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Header */}
        <div className="text-center reveal-up">
          <SectionLabel text="Fluid Living" centered />
          <h1 className="text-6xl lg:text-8xl font-serif font-bold tracking-tighter">Luxury <span className="italic font-light text-[#FFDAB9]">Fractional.</span></h1>
          <p className="mt-8 text-[#FFF8F0]/40 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Experience premium heritage furniture without the commitment of ownership. High-end living, perfectly adapted to your transient journey.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 reveal-up">
           {[
             { t: 'Atelier Basics', p: '2,500', d: 'Curated selection of functional masterworks. Ideal for studio manifests.', i: Sofa },
             { t: 'Legacy Suite', p: '6,000', d: 'Complete room orchestrations featuring our signature teak and walnut pieces.', i: Warehouse },
             { t: 'Bespoke Node', p: '12,500', d: 'Fully tailored furniture manifest with AI design orchestration included.', i: Key }
           ].map((tier, i) => (
             <div key={i} className="glass-panel p-12 rounded-[56px] border-white/5 group hover:border-[#A67B5B]/30 transition-all relative">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-10 border border-white/10 group-hover:bg-[#A67B5B]/20 transition-all">
                   <tier.i className="w-8 h-8 text-[#FFDAB9]" />
                </div>
                <h4 className="font-serif text-3xl font-bold mb-4">{tier.t}</h4>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-10">Starting Manifest</p>
                <div className="flex items-baseline gap-2 mb-10">
                   <span className="text-4xl font-serif font-black">₹{tier.p}</span>
                   <span className="text-white/30 text-sm italic">/cycle</span>
                </div>
                <p className="text-[#FFF8F0]/30 font-light leading-relaxed mb-12">{tier.d}</p>
                <a href={`mailto:info@saikamal.com?subject=Rental%20lease%20inquiry%20-%20${encodeURIComponent(tier.t)}`} className="block w-full bg-white/5 group-hover:bg-white group-hover:text-[#2E1F13] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center">Configure Lease</a>
             </div>
           ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center reveal-up">
           <div className="space-y-12">
              <h2 className="text-5xl font-serif font-bold tracking-tighter">Why <span className="italic font-light text-[#FFDAB9]">Rental?</span></h2>
              <div className="space-y-10">
                 {[
                   { i: Clock, t: 'Cycle Flexibility', d: 'Lease from 3 to 24 cycles with seamless extension protocols.' },
                   { i: Zap, t: 'Rapid Rotation', d: 'Update your manifest every 6 cycles as your aesthetic DNA evolves.' },
                   { i: ShieldCheck, t: 'Damage Fidelity', d: 'Comprehensive coverage for normal wear and accidental texture variations.' },
                   { i: Coins, t: 'Fractional Intake', d: 'Predictable monthly manifests with zero interest or protocol fees.' }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-8 group">
                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/2 border border-white/10 flex items-center justify-center text-[#FFDAB9] group-hover:bg-[#A67B5B] group-hover:text-white transition-all">
                         <item.i className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="text-xl font-bold mb-2">{item.t}</h4>
                         <p className="text-white/30 text-sm font-light leading-relaxed">{item.d}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           <div className="h-[600px] rounded-[60px] overflow-hidden border border-white/10 shadow-3xl">
              <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200" alt="Rental Space" className="w-full h-full object-cover" />
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

export default Rentals;
