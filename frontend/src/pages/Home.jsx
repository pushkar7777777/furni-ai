import React, { useEffect, useRef, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, Leaf, Sparkles, CheckCircle2, Star, Phone, Mail, MapPin,
  Clock, Truck, Shield, Wrench, ChevronRight, Play, Quote, Package, Armchair,
  Globe, Send, Building, MessageSquare
} from 'lucide-react';
import { getProducts } from '../services/api';
import Footer from '../components/Footer';
import useMobile from '../utils/useMobile';
import OptimizedImage from '../components/OptimizedImage';

gsap.registerPlugin(ScrollTrigger);

// ─── Reusable Section Label ────────────────────────────────────────
const SectionLabel = memo(({ text, centered = false }) => (
  <div className={`flex items-center gap-3 mb-6 ${centered ? 'justify-center' : ''}`}>
    {!centered && <div className="w-12 h-[1px] bg-[#A67B5B]" />}
    <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-[#FFDAB9]">{text}</span>
    {centered && <div className="w-12 h-[1px] bg-[#A67B5B]" />}
  </div>
));

// ─── Stat Counter ──────────────────────────────────────────────────
const Stat = memo(({ value, label }) => (
  <div className="text-center group">
    <div className="text-4xl font-serif font-bold text-[#FFF8F0] mb-1 group-hover:scale-110 transition-transform duration-500">{value}</div>
    <div className="text-[10px] uppercase tracking-widest text-[#FFDAB9]/50 font-bold">{label}</div>
  </div>
));

// ─── Premium Branding Helper ──────────────────────────────────────
const getPremiumName = (name) => {
  if (name.length < 4) return `Exclusive ${name.toUpperCase()} Piece`;
  return name;
};

export default function Home() {
  const heroRef = useRef(null);
  const isMobile = useMobile();
  const [products, setProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ h: 11, m: 47, s: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getProducts().then(data => setProducts(data.slice(0, 4))).catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobile) {
        // Simplified Mobile Entrance
        gsap.fromTo('.hero-label, .hero-heading, .hero-sub, .hero-cta', 
          { y: 20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'expo.out' }
        );
        gsap.fromTo('.hero-img-main', { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.5 });
        return;
      }

      // Desktop Entrance
      gsap.fromTo('.hero-label', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.2 });
      gsap.fromTo('.hero-heading span', { y: 100, rotateX: -30, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'expo.out', delay: 0.4 });
      gsap.fromTo('.hero-sub', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 1 });
      gsap.fromTo('.hero-cta', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 1.2 });
      gsap.fromTo('.hero-img-main', { scale: 1.2, rotate: 2, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 2, ease: 'expo.inOut', delay: 0.3 });
      gsap.fromTo('.hero-badge', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, stagger: 0.3, ease: 'elastic.out(1, 0.5)', delay: 1.5 });

      // Parallax Bubbles
      gsap.to('.bubble-bg', {
        y: (i, target) => -target.dataset.speed * 200,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });

      // Smooth reveals
      gsap.utils.toArray('.reveal-up').forEach(el => {
        gsap.fromTo(el,
          { y: 80, opacity: 0, scale: 0.95 },
          { 
            y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              end: 'top 70%',
              scrub: 0.5,
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Image Parallax
      gsap.utils.toArray('.parallax-img').forEach(el => {
        gsap.to(el, {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            scrub: true
          }
        });
      });
    }, heroRef);
    return () => ctx.revert();
  }, [isMobile]);

  const pad = n => String(n).padStart(2, '0');

  return (
    <div ref={heroRef} className="bg-transparent text-[#FFF8F0] overflow-x-hidden selection:bg-[#A67B5B] selection:text-white">

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Giant Bg Text - Hidden on mobile to reduce render load */}
        {!isMobile && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[30vw] font-serif font-black text-white/[0.015] whitespace-nowrap leading-none tracking-tighter">GALLERY</span>
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          <div className="will-change-transform">
            <div className="hero-label">
              <SectionLabel text="Saikamal Furnitures • Collection 2026" />
            </div>
            <h1 className="hero-heading text-5xl sm:text-7xl lg:text-[10rem] font-serif leading-[0.9] mb-8 lg:mb-10 perspective-[1000px]">
              <span className="block italic font-light text-[#FFDAB9]">Timeless</span>
              <span className="block font-bold mt-2 tracking-tighter">Elegance.</span>
              <span className="block font-bold text-[#A67B5B] tracking-tighter">Luxury Living.</span>
            </h1>
            <p className="hero-sub text-lg lg:text-xl text-[#FFF8F0]/50 mb-10 lg:mb-14 max-w-lg leading-relaxed font-light italic">
              "Crafting the spaces where memories flourish—where every piece tells a story of uncompromising craftsmanship and timeless beauty."
            </p>

            <div className="hero-cta flex flex-wrap items-center gap-6 lg:gap-8 mb-12 lg:mb-16">
              <Link to="/products"
                className="group relative flex items-center gap-4 bg-[#A67B5B] text-[#FFF8F0] px-10 lg:px-12 py-5 lg:py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#8B654A] transition-all shadow-[0_20px_50px_rgba(166,123,91,0.3)] hover:translate-y-[-4px] active:translate-y-0">
                Shop Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {!isMobile && (
                <a href="#atelier" className="flex items-center gap-5 text-[#FFF8F0]/80 hover:text-[#FFDAB9] transition-all group">
                  <div className="w-16 h-16 rounded-[24px] border border-white/10 flex items-center justify-center group-hover:bg-[#A67B5B]/10 group-hover:border-[#A67B5B]/30 transition-all">
                    <Play className="w-5 h-5 fill-[#FFDAB9] text-[#FFDAB9]" />
                  </div>
                  <span className="text-[10px] font-black tracking-[0.4em] uppercase">The Atelier Film</span>
                </a>
              )}
            </div>

            <div className="hero-cta grid grid-cols-3 gap-8 lg:gap-16 pt-10 lg:pt-12 border-t border-white/5 max-w-lg">
              <Stat value="50k+" label="Happy Homes" />
              <Stat value="25y" label="Excellence" />
              <Stat value="4.9" label="Rating" />
            </div>
          </div>

          <div className={`relative flex items-center justify-center will-change-transform ${isMobile ? 'h-[400px] mt-10' : 'h-[700px]'}`}>
            {/* 3D Visual Composition */}
            <div className={`hero-img-main relative rounded-[40px] lg:rounded-[80px] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] z-10 group ${
              isMobile ? 'w-full h-full' : 'w-[450px] h-[600px]'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#2E1F13] via-transparent to-transparent z-20 opacity-60" />
              <OptimizedImage 
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200"
                alt="Main Piece"
                aspectRatio="h-full w-full"
                className="group-hover:scale-110 transition-transform duration-[3s]"
              />
              <div className="absolute bottom-8 lg:bottom-12 left-8 lg:left-12 z-30">
                <div className="flex items-center gap-3 mb-2 lg:mb-3">
                   <div className="w-8 h-[1px] bg-[#FFDAB9]" />
                   <span className="text-[9px] uppercase tracking-[0.4em] font-black text-[#FFDAB9]">Signature Series</span>
                </div>
                <p className="text-[#FFF8F0] font-serif italic text-2xl lg:text-3xl">Saikamal Royal Suite</p>
              </div>
            </div>

            {/* Overlapping Badges - simplified on mobile */}
            {!isMobile && (
              <>
                <div className="hero-badge absolute -top-8 -right-8 glass-card p-8 rounded-[40px] z-40 border-white/20 shadow-3xl">
                  <div className="w-14 h-14 bg-[#FFDAB9]/10 rounded-2xl flex items-center justify-center mb-4">
                    <Sparkles className="w-7 h-7 text-[#FFDAB9]" />
                  </div>
                  <p className="font-bold text-lg mb-1">AI Curation</p>
                  <p className="text-[9px] text-[#FFDAB9]/40 tracking-[0.3em] uppercase font-black">Neural Design</p>
                </div>

                <div className="hero-badge absolute bottom-16 -left-16 glass-panel p-10 rounded-[48px] z-40 max-w-[220px] border-white/10 shadow-3xl">
                  <SectionLabel text="Seasonal Tier" />
                  <p className="text-4xl font-serif font-black text-[#A67B5B]">-60%</p>
                  <p className="text-[10px] text-[#FFF8F0]/30 mt-4 font-bold uppercase tracking-widest leading-loose">On archival teak & walnut archives</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>


      {/* Offer Countdown */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`glass-card rounded-[40px] lg:rounded-[80px] overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center border-white/5 relative ${isMobile ? '' : 'min-h-[600px]'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#A67B5B]/5 blur-[120px] -z-10" />
            <div className="p-10 lg:p-24 reveal-up">
              <SectionLabel text="Limited Time Offer" />
              <h2 className="text-5xl lg:text-8xl font-serif font-bold mb-8 lg:mb-10 leading-[0.9] tracking-tighter text-white">
                Saikamal <br /><span className="italic font-light text-[#FFDAB9]">Premium Sale.</span>
              </h2>
              <p className="text-[#FFF8F0]/40 mb-10 lg:mb-14 max-w-sm leading-relaxed text-lg font-light">Enjoy exclusive discounts on our signature collections. Complimentary delivery and white-glove installation included.</p>

              <div className="flex gap-4 lg:gap-8 mb-10 lg:mb-16">
                {[
                  { l: 'HOURS', v: pad(timeLeft.h) },
                  { l: 'MINUTES', v: pad(timeLeft.m) },
                  { l: 'SECONDS', v: pad(timeLeft.s) }
                ].map(({ l, v }) => (
                  <div key={l} className="flex flex-col items-center bg-white/2 rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 min-w-[90px] lg:min-w-[120px] border border-white/5 shadow-2xl group">
                    <span className="text-3xl lg:text-5xl font-serif font-bold text-[#FFDAB9] group-hover:scale-110 transition-transform duration-500">{v}</span>
                    <span className="text-[7px] lg:text-[8px] uppercase tracking-[0.4em] text-white/20 font-black mt-3 lg:mt-4">{l}</span>
                  </div>
                ))}
              </div>
              <Link to="/products" className="inline-flex items-center gap-4 bg-[#FFF8F0] text-[#2E1F13] px-10 lg:px-12 py-5 lg:py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.05] shadow-3xl transition-all active:scale-95 w-full lg:w-auto justify-center">
                Explore Catalog <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            {!isMobile && (
              <div className="h-full min-h-[500px] relative overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1400&auto=format&fit=crop"
                  alt="Furniture" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#20150d] via-transparent to-transparent opacity-80" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                   <Sparkles className="w-8 h-8 text-[#FFDAB9]" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      {products.length > 0 && (
        <section className="py-20 lg:py-32 px-4 bg-[#FFF8F0]/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 lg:mb-20 reveal-up gap-8">
              <div>
                <SectionLabel text="Our Collections" />
                <h2 className="text-5xl lg:text-7xl font-serif font-bold tracking-tighter">Saikamal <span className="italic font-light text-[#FFDAB9]">Showcase.</span></h2>
              </div>
              <Link to="/products" className="px-10 py-4 rounded-xl border border-white/10 hover:bg-[#FFF8F0] text-white hover:text-[#2E1F13] transition-all font-black text-[10px] uppercase tracking-[0.3em]">Browse All Designs</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {products.map((p, i) => (
                <div key={p.id} className="reveal-up group">
                  <div className="aspect-[3/4.5] rounded-[40px] lg:rounded-[56px] overflow-hidden relative mb-6 lg:mb-8 border border-white/5 shadow-2xl">
                    <OptimizedImage
                      src={`https://images.unsplash.com/photo-${['1555041469-a586c61ea9bc', '1567538096630-e0c55bd6374c', '1493663284031-b7e3aefcae8e', '1592078615290-033ee584e267'][i % 4]}?q=80&w=800`}
                      alt={p.name}
                      aspectRatio="h-full w-full"
                      className="group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className={`absolute inset-4 bottom-4 glass-panel p-6 lg:p-8 rounded-[32px] lg:rounded-[40px] transition-all duration-500 flex flex-col justify-between ${
                      isMobile ? 'translate-y-0 opacity-100 bg-black/40 backdrop-blur-md' : 'translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                    }`}>
                      <div>
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-black text-[#FFDAB9] uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full">{p.material}</span>
                            {!isMobile && <span className="text-white/20 font-black text-[8px] uppercase tracking-widest italic">New Arrival</span>}
                         </div>
                         <h3 className="text-xl lg:text-2xl font-serif font-bold text-white mt-2 lg:mt-4">{getPremiumName(p.name)}</h3>
                      </div>
                      <div>
                         <p className="text-2xl lg:text-3xl font-serif font-bold text-[#A67B5B] mb-4 lg:mb-6">₹{Number(p.price).toLocaleString()}</p>
                         <Link to={`/products/${p.id}`} className="w-full block bg-[#FFF8F0] text-[#2E1F13] text-center py-3 lg:py-4 rounded-xl lg:rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FFDAB9] transition-colors shadow-xl">Secure Piece</Link>
                      </div>
                    </div>
                  </div>
                  <div className="px-4">
                     <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20 mb-2">Collection v.01</p>
                     <h3 className="font-serif text-2xl font-bold group-hover:text-[#FFDAB9] transition-colors">{getPremiumName(p.name)}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Philosophy / Features */}
      <section id="features" className="py-20 lg:py-32 px-4">
        <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 lg:mb-24 reveal-up">
            <SectionLabel text="Saikamal Quality Standards" centered />
            <h2 className="text-5xl lg:text-8xl font-serif font-bold text-[#FFF8F0] tracking-tighter">Uncompromising <span className="italic font-light text-[#FFDAB9]">Craftsmanship.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {[
              { icon: Truck, title: 'White Glove', desc: 'Premium logistics and expert assembly at your absolute convenience.', color: 'from-[#A67B5B]/20' },
              { icon: Shield, title: 'Heritage Shield', desc: '5-year comprehensive fidelity guarantee on every artisan piece.', color: 'from-blue-500/10' },
              { icon: Sparkles, title: 'Neural Synergy', desc: 'AI-driven room orchestration tailored to your aesthetic DNA.', color: 'from-purple-500/10' },
              { icon: Leaf, title: 'Eco Excellence', desc: '100% regenerative sourcing from certified global plantations.', color: 'from-emerald-500/10' },
            ].map((f, i) => (
              <div key={i} className="reveal-up glass-panel p-10 lg:p-12 rounded-[40px] lg:rounded-[48px] border-white/5 hover:border-[#FFDAB9]/20 transition-all group overflow-hidden relative min-h-[340px] lg:min-h-[380px] flex flex-col justify-end">
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700`} />
                <div className="relative z-10">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-[20px] lg:rounded-[24px] bg-white/2 flex items-center justify-center mb-8 lg:mb-10 border border-white/5 group-hover:scale-110 group-hover:bg-[#A67B5B]/10 transition-all duration-500">
                    <f.icon className="w-7 h-7 lg:w-8 lg:h-8 text-[#FFDAB9]" />
                  </div>
                  <h3 className="font-serif font-bold text-2xl lg:text-3xl mb-4 lg:mb-6 tracking-tight">{f.title}</h3>
                  <p className="text-[#FFF8F0]/30 font-light leading-relaxed text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patron Statements (Testimonials) */}
      <section className="py-20 lg:py-32 px-4">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16 lg:mb-20 reveal-up">
              <SectionLabel text="Patron Journals" centered />
              <h2 className="text-4xl lg:text-7xl font-serif font-bold tracking-tighter">Voices of <span className="italic font-light text-[#FFDAB9]">Excellence.</span></h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                { n: 'Vikram Rajawat', r: 'Executive, Pune', q: 'The craftsmanship at Saikamal is unparalleled. Their furniture transformed our estate into a home of absolute warmth.', i: 'V' },
                { n: 'Elena Rossi', r: 'Designer, Milan', q: 'A rare find where AI innovation perfectly meets heavy-timber heritage. Truly the definitive future of interior craft.', i: 'E' },
                { n: 'Arjun Mehta', r: 'Architect, Delhi', q: 'Clean lines, sustainable sourcing, and flawless delivery. They are our primary partners for every luxury project.', i: 'A' },
              ].map((t, i) => (
                <div key={i} className="reveal-up glass-panel p-10 lg:p-12 rounded-[40px] lg:rounded-[48px] border-white/5 hover:bg-white/[0.02] transition-colors relative">
                   <Quote className="absolute top-8 right-10 w-10 h-10 lg:w-12 lg:h-12 text-[#FFDAB9]/5" />
                   <div className="flex gap-1 mb-6 lg:mb-8">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 lg:w-4 lg:h-4 fill-[#FFDAB9] text-[#FFDAB9]" />)}
                   </div>
                   <p className="text-[#FFF8F0]/60 italic text-base lg:text-lg leading-relaxed mb-8 lg:mb-10 font-light">"{t.q}"</p>
                   <div className="flex items-center gap-4 lg:gap-5">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-[#A67B5B] flex items-center justify-center font-serif font-black text-xl lg:text-2xl text-white shadow-xl">{t.i}</div>
                      <div>
                         <p className="font-bold text-base lg:text-lg">{t.n}</p>
                         <p className="text-[8px] lg:text-[9px] uppercase tracking-[0.3em] font-black text-[#FFDAB9]/40">{t.r}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 lg:py-32 px-4">
         <div className="max-w-5xl mx-auto">
            <div className="glass-panel rounded-[40px] lg:rounded-[60px] p-10 lg:p-24 text-center reveal-up border-[#A67B5B]/20 bg-[#A67B5B]/5 relative overflow-hidden">
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FFDAB9]/10 blur-[80px]" />
               <SectionLabel text="Saikamal Insiders" centered />
               <h2 className="text-4xl lg:text-7xl font-serif font-bold mb-6 lg:mb-8 tracking-tighter">Join the <span className="italic font-light text-[#FFDAB9]">Club.</span></h2>
               <p className="text-white/40 mb-10 lg:mb-12 max-w-xl mx-auto font-light leading-relaxed">Receive exclusive pre-launches, member-only discounts, design consultations, and invitations to private showroom events.</p>
               <form onSubmit={e => e.preventDefault()} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 p-2 rounded-2xl lg:rounded-2xl bg-white/5 border border-white/10">
                  <input type="email" placeholder="your@email.com" className="bg-transparent border-none flex-1 px-6 py-4 focus:outline-none text-white font-medium text-sm" />
                  <button className="bg-[#A67B5B] hover:bg-[#8B654A] text-white px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-3">
                     <Send className="w-4 h-4" /> <span className="text-[10px] uppercase font-black tracking-widest">Subscribe</span>
                  </button>
               </form>
            </div>
         </div>
      </section>

      {/* The Atelier (Location/Contact) */}
      <section id="atelier" className="py-20 lg:py-32 px-4">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="reveal-up">
               <SectionLabel text="Our Presence" />
               <h2 className="text-5xl lg:text-6xl font-serif font-bold mb-8 lg:mb-10 tracking-tighter">Visit the <span className="italic font-light text-[#FFDAB9]">Atelier.</span></h2>
               <p className="text-white/30 text-lg mb-10 lg:mb-12 leading-relaxed font-light">Experience the craftsmanship in person. Our Pune flagship showroom features exclusive limited-run collections not available online.</p>
               
               <div className="space-y-6 lg:space-y-8">
                  {[
                    { i: MapPin, t: 'Atelier Address', d: 'Plot 42, Heritage District, Pune, MH 411001' },
                    { i: Phone, t: 'Private Line', d: '+91 800-SAIKAMAL (Toll Free)' },
                    { i: Clock, t: 'Atelier Hours', d: 'Monday - Saturday: 10:00 — 19:00' },
                  ].map((c, i) => (
                    <div key={i} className="flex gap-5 lg:gap-6 items-start group">
                       <div className="w-12 h-12 lg:w-14 lg:h-14 shrink-0 rounded-xl lg:rounded-2xl bg-white/2 border border-white/5 flex items-center justify-center text-[#FFDAB9] group-hover:bg-[#A67B5B] group-hover:text-white transition-all cursor-pointer">
                          <c.i className="w-5 h-5 lg:w-6 lg:h-6" />
                       </div>
                       <div className="mt-1">
                          <p className="text-[9px] lg:text-[10px] uppercase font-black tracking-[0.4em] text-white/20 mb-1">{c.t}</p>
                          <p className="text-lg lg:text-xl font-bold tracking-tight">{c.d}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="reveal-up h-[400px] lg:h-[600px] rounded-[40px] lg:rounded-[60px] overflow-hidden border border-white/5 shadow-3xl bg-white/2 relative">
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 lg:p-12">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 lg:mb-8 border border-white/10 animate-bounce">
                     <MapPin className="w-8 h-8 lg:w-10 lg:h-10 text-[#FFDAB9]" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-serif font-bold mb-3 lg:mb-4">Pune Flagship</h3>
                  <p className="text-white/40 text-sm max-w-xs mb-6 lg:mb-8 italic">"Where traditional timber meets futuristic design."</p>
                  <button className="bg-white/5 hover:bg-white/10 text-white px-8 lg:px-10 py-3 lg:py-4 rounded-xl border border-white/10 text-[10px] uppercase font-black tracking-[0.3em] transition-all">Coordinate Route</button>
               </div>
               <div className="absolute bottom-8 lg:bottom-10 left-8 lg:left-10 right-8 lg:right-10 grid grid-cols-2 gap-4 lg:gap-6 opacity-30">
                  <div className="h-32 lg:h-40 bg-[#A67B5B]/20 rounded-[24px] lg:rounded-[32px]" />
                  <div className="h-32 lg:h-40 bg-white/10 rounded-[24px] lg:rounded-[32px]" />
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <Footer />

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .will-change-transform { will-change: transform, opacity; }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}

