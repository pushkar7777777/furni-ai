import React from 'react';
import { RefreshCcw, ArrowRight, ShieldCheck, Zap, History, Scale, Handshake } from 'lucide-react';

const Exchange = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-[#FFF8F0]">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Header */}
        <div className="text-center reveal-up">
          <SectionLabel text="Legacy Evolution" centered />
          <h1 className="text-6xl lg:text-8xl font-serif font-bold tracking-tighter">Artisan <span className="italic font-light text-[#FFDAB9]">Exchange.</span></h1>
          <p className="mt-8 text-[#FFF8F0]/40 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Evolve your space by exchanging your legacy Saikamal pieces for new masterworks. A sustainable path to aesthetic refinement.
          </p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 reveal-up">
           {[
             { t: '1. Appraisal', d: 'Our master artisans evaluate the texture and integrity of your current legacy piece.', i: Scale },
             { t: '2. Valuation', d: 'Receive an instant manifest credit based on the archival value of the timber and craft.', i: History },
             { t: '3. Selection', d: 'Apply your legacy credit towards the acquisition of a new bespoke manifest.', i: RefreshCcw }
           ].map((step, i) => (
             <div key={i} className="glass-panel p-12 rounded-[56px] border-white/5 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-10 border border-white/10">
                   <step.i className="w-10 h-10 text-[#FFDAB9]" />
                </div>
                <h4 className="font-serif text-3xl font-bold mb-6">{step.t}</h4>
                <p className="text-[#FFF8F0]/30 font-light leading-relaxed">{step.d}</p>
             </div>
           ))}
        </div>

        {/* Feature CTA */}
        <div className="glass-panel rounded-[60px] p-16 lg:p-24 border-[#A67B5B]/20 bg-[#A67B5B]/5 reveal-up text-center">
           <h2 className="text-5xl font-serif font-bold mb-8 tracking-tighter">Ready to <span className="italic font-light text-[#FFDAB9]">Evolve?</span></h2>
           <p className="text-white/40 mb-12 max-w-xl mx-auto font-light leading-relaxed">Schedule a private appraisal with our guild consultants today. We accept Saikamal legacy pieces from any collection year.</p>
           <a href="mailto:info@saikamal.com?subject=Furniture%20exchange%20appraisal" className="inline-block bg-[#FFF8F0] text-[#2E1F13] px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:scale-105 transition-all shadow-3xl">Inquire Protocol</a>
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

export default Exchange;
