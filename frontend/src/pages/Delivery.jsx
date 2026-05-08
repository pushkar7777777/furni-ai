import React from 'react';
import { Truck, MapPin, ShieldCheck, Clock, Zap, Globe, Armchair, Hammer } from 'lucide-react';

const Delivery = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-[#FFF8F0]">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Header */}
        <div className="text-center reveal-up">
          <SectionLabel text="Logistical Precision" centered />
          <h1 className="text-6xl lg:text-8xl font-serif font-bold tracking-tighter">White-Glove <span className="italic font-light text-[#FFDAB9]">Manifest.</span></h1>
          <p className="mt-8 text-[#FFF8F0]/40 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Your masterwork's journey is orchestrated with the same precision as its creation. Secure, synchronized, and seamlessly delivered.
          </p>
        </div>

        {/* Timeline/Process */}
        <div className="relative pt-20 reveal-up">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white/5 hidden lg:block" />
           <div className="space-y-32">
              {[
                { t: 'Atelier Release', d: 'Your piece undergoes a final manifest verification before departing the Pune atelier.', i: Armchair, side: 'right' },
                { t: 'Secure Transit', d: 'Climate-controlled orchestration ensures the timber and fabric integrity remains pristine.', i: Truck, side: 'left' },
                { t: 'Artisan Assembly', d: 'Our guild technicians assemble and position your piece with architectural precision.', i: Hammer, side: 'right' },
                { t: 'Heritage Handover', d: 'A comprehensive care manifest is provided as your piece begins its legacy journey.', i: ShieldCheck, side: 'left' }
              ].map((step, i) => (
                <div key={i} className={`flex flex-col lg:flex-row items-center gap-16 ${step.side === 'left' ? 'lg:flex-row-reverse' : ''}`}>
                   <div className="lg:w-1/2 flex justify-center">
                      <div className="glass-panel p-12 rounded-[48px] border-white/5 max-w-md group hover:border-[#A67B5B]/30 transition-all">
                         <div className="w-14 h-14 rounded-2xl bg-[#A67B5B]/10 flex items-center justify-center text-[#FFDAB9] mb-8">
                            <step.i className="w-7 h-7" />
                         </div>
                         <h4 className="font-serif text-2xl font-bold mb-4">{step.t}</h4>
                         <p className="text-[#FFF8F0]/30 font-light leading-relaxed">{step.d}</p>
                      </div>
                   </div>
                   <div className="hidden lg:flex w-12 h-12 rounded-full bg-[#1d120c] border-4 border-[#A67B5B] items-center justify-center relative z-10 shadow-[0_0_20px_rgba(166,123,91,0.5)]">
                      <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                   </div>
                   <div className="lg:w-1/2" />
                </div>
              ))}
           </div>
        </div>

        {/* Reach Section */}
        <div className="glass-panel rounded-[60px] p-16 border-[#A67B5B]/20 bg-[#A67B5B]/5 reveal-up grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div>
              <h2 className="text-5xl font-serif font-bold mb-8 tracking-tighter">Operational <span className="italic font-light text-[#FFDAB9]">Reach.</span></h2>
              <p className="text-white/40 mb-12 font-light leading-relaxed">Our logistics network currently covers all major metropolitan nodes in the subcontinent.</p>
              <div className="grid grid-cols-2 gap-8">
                 {[
                   { t: 'Tier 1 Nodes', d: '24-48 Hour Manifest' },
                   { i: Globe, t: 'Pan-India', d: '3-7 Cycle Transit' },
                   { i: Zap, t: 'Instant Node', d: 'Pune Exclusive' },
                   { i: Clock, t: 'Scheduled', d: 'Precise Time-Slots' }
                 ].map((stat, i) => (
                   <div key={i}>
                      <h5 className="font-serif font-bold text-xl text-[#FFDAB9] mb-1">{stat.t}</h5>
                      <p className="text-xs uppercase font-black tracking-widest text-white/20">{stat.d}</p>
                   </div>
                 ))}
              </div>
           </div>
           <div className="h-96 rounded-[40px] overflow-hidden border border-white/10 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800" alt="Logistics Map" className="w-full h-full object-cover" />
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

export default Delivery;
