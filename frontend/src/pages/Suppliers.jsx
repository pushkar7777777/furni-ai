import React from 'react';
import { Building, Globe, Handshake, ShieldCheck, TreePine, Zap, Star, Shield } from 'lucide-react';

const Suppliers = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-[#FFF8F0]">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Header */}
        <div className="text-center reveal-up">
          <SectionLabel text="Global Consortium" centered />
          <h1 className="text-6xl lg:text-8xl font-serif font-bold tracking-tighter">Guild <span className="italic font-light text-[#FFDAB9]">Partners.</span></h1>
          <p className="mt-8 text-[#FFF8F0]/40 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Our masterworks are only as noble as the materials that forge them. We partner with the world's most elite timber, fabric, and logistics specialists.
          </p>
        </div>

        {/* Categories of Partners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 reveal-up">
           {[
             { t: 'The Timber Alliance', d: 'Sourcing 100% regenerative teak, walnut, and ebony from certified global plantations.', i: TreePine, b: 'bg-emerald-500/10' },
             { t: 'Textile Artisans', d: 'Italian upholstery guilds and Belgian linen masters who define the touch of our collections.', i: Star, b: 'bg-amber-500/10' },
             { t: 'Precision Hardware', d: 'German and Japanese engineering firms providing the silent, seamless mechanics of our pieces.', i: Zap, b: 'bg-blue-500/10' },
             { t: 'Heritage Logistics', d: 'White-glove specialists trained in the handling and assembly of architectural furniture.', i: Globe, b: 'bg-purple-500/10' }
           ].map((cat, i) => (
             <div key={i} className="glass-panel p-16 rounded-[60px] border-white/5 group hover:border-[#A67B5B]/30 transition-all flex flex-col md:flex-row gap-12 items-center">
                <div className={`w-24 h-24 shrink-0 rounded-3xl ${cat.b} flex items-center justify-center text-[#FFDAB9] group-hover:scale-110 transition-transform`}>
                   <cat.i className="w-12 h-12" />
                </div>
                <div>
                   <h4 className="font-serif text-3xl font-bold mb-4">{cat.t}</h4>
                   <p className="text-[#FFF8F0]/30 font-light leading-relaxed">{cat.d}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Induct/Contact Section */}
        <div className="glass-panel rounded-[60px] p-16 lg:p-24 border-[#A67B5B]/20 bg-[#A67B5B]/5 reveal-up grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div>
              <h2 className="text-5xl font-serif font-bold mb-8 tracking-tighter">Become a <span className="italic font-light text-[#FFDAB9]">Member.</span></h2>
              <p className="text-white/40 mb-12 font-light leading-relaxed italic">"Integrity of material is the foundation of legacy artistry."</p>
              <div className="space-y-8">
                 {[
                   'Certified Sustainable Sourcing',
                   'Exemplary Quality Manifests',
                   'Ethical Labor Protocols',
                   'Technological Integration Ready'
                 ].map((req, i) => (
                   <div key={i} className="flex items-center gap-4">
                      <Shield className="w-5 h-5 text-[#A67B5B]" />
                      <span className="text-sm tracking-tight text-white/60">{req}</span>
                   </div>
                 ))}
              </div>
           </div>
           <div className="bg-[#1d120c] p-10 rounded-[40px] border border-white/5 text-center">
              <Handshake className="w-16 h-16 text-[#FFDAB9] mx-auto mb-8" />
              <h4 className="text-2xl font-serif font-bold mb-6">Partner Registry</h4>
              <p className="text-white/30 text-sm mb-10">We are always seeking to expand our guild with specialists who share our aesthetic and ethical DNA.</p>
              <button className="w-full bg-[#A67B5B] hover:bg-[#8B654A] text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all">Submit Manifest</button>
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

export default Suppliers;
