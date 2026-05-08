import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Tag, Clock, ArrowRight, Gift, Percent, Zap, ShieldCheck } from 'lucide-react';
import { getProducts } from '../services/api';
import { getProductImage } from '../utils/productImages';

const Offers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    setLoading(true);
    getProducts().then(data => {
      setProducts(data.slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const currentOffers = [
    {
      title: 'Monarch Collection Debut',
      desc: 'Exclusive 25% refinement on all Royal Walnut pieces for early patrons.',
      code: 'MONARCH25',
      expiry: 'Ends in 4 days',
      bg: 'from-[#A67B5B]/20'
    },
    {
      title: 'Atelier Spring Manifest',
      desc: 'Acquire any three items and receive a curated bespoke accessory set.',
      code: 'SPRINGTRIO',
      expiry: 'Seasonal Offer',
      bg: 'from-[#FFDAB9]/10'
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-[#FFF8F0]">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Header */}
        <div className="text-center reveal-up">
          <div className="flex items-center justify-center gap-3 mb-6">
             <div className="w-12 h-[1px] bg-[#A67B5B]" />
             <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-[#FFDAB9]">Patron Privileges</span>
             <div className="w-12 h-[1px] bg-[#A67B5B]" />
          </div>
          <h1 className="text-6xl lg:text-8xl font-serif font-bold tracking-tighter">Exclusive <span className="italic font-light text-[#FFDAB9]">Manifests.</span></h1>
          <p className="mt-8 text-[#FFF8F0]/40 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Discover unprecedented value through our curated registry of seasonal offers and atelier privileges.
          </p>
        </div>

        {/* Featured Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 reveal-up">
          {currentOffers.map((offer, i) => (
            <div key={i} className={`glass-panel rounded-[60px] p-16 border-white/5 relative overflow-hidden group hover:border-[#A67B5B]/30 transition-all duration-700`}>
               <div className={`absolute inset-0 bg-gradient-to-br ${offer.bg} to-transparent opacity-50 group-hover:opacity-100 transition-opacity`} />
               
               <div className="relative z-10">
                  <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center mb-12 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                     <Percent className="w-10 h-10 text-[#FFDAB9]" />
                  </div>
                  
                  <h3 className="text-4xl font-serif font-bold mb-6">{offer.title}</h3>
                  <p className="text-[#FFF8F0]/40 text-lg mb-12 font-light leading-relaxed">{offer.desc}</p>
                  
                  <div className="flex flex-wrap items-center gap-8">
                     <div className="px-8 py-4 rounded-2xl bg-white/5 border border-dashed border-[#FFDAB9]/40 flex items-center gap-4">
                        <span className="text-[10px] uppercase font-black tracking-widest text-[#FFDAB9]">Code:</span>
                        <span className="font-serif font-bold text-2xl tracking-widest">{offer.code}</span>
                     </div>
                     <span className="text-[10px] uppercase font-black tracking-widest text-white/20 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {offer.expiry}
                     </span>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Product Specific Values */}
        <div className="space-y-12 reveal-up">
           <div className="flex items-center justify-between">
              <h2 className="text-3xl font-serif font-bold">Trending <span className="italic font-light text-[#FFDAB9]">Acquisitions</span></h2>
              <button onClick={loadProducts} className="text-[10px] uppercase font-black tracking-widest text-white/20 hover:text-white transition-colors">Refresh Catalog</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {loading ? [1,2,3].map(i => <div key={i} className="h-[400px] rounded-[40px] bg-white/5 animate-pulse" />) :
               products.map(p => (
                 <div key={p.id} className="glass-panel rounded-[40px] p-8 border-white/5 group hover:border-[#A67B5B]/20 transition-all">
                    <div className="aspect-square rounded-[32px] overflow-hidden mb-8 bg-white/2">
                       <img src={getProductImage(p)} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                       <h4 className="font-serif font-bold text-xl">{p.name}</h4>
                       <span className="text-emerald-400 font-bold text-xs">-15%</span>
                    </div>
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-8">Exclusive Online Manifest</p>
                    <Link to={`/products/${p.id}`} className="block w-full bg-white/5 hover:bg-[#A67B5B] text-[#FFF8F0] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center">Secure Acquisition</Link>
                 </div>
               ))
              }
           </div>
        </div>

        {/* Global Privileges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-up">
           {[
             { i: Zap, t: 'Instant Delivery', d: 'Available on all stock acquisitions within the Pune metropolitan node.' },
             { i: Gift, t: 'Bespoke Gifting', d: 'Premium wooden-crate packaging and custom wax-sealed invitations included.' },
             { i: ShieldCheck, t: 'Lifetime Fidelity', d: 'Extended heritage coverage on every structural component of your piece.' }
           ].map((item, i) => (
             <div key={i} className="glass-panel p-10 rounded-[40px] border-white/5 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#A67B5B]/10 flex items-center justify-center text-[#FFDAB9] mb-8">
                   <item.i className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-2xl mb-4">{item.t}</h4>
                <p className="text-[#FFF8F0]/30 text-sm leading-relaxed font-light">{item.d}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Offers;
