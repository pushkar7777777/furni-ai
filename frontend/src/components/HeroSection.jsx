import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sofa } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#A67B5B]/30 via-[#3f2919]/20 to-transparent -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 rounded-full bg-[#FFDAB9]/10 border border-[#FFDAB9]/30 px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFDAB9]">🔥 Welcome to Saikamal Furnitures</span>
              </div>
              
              <h1 className="font-serif text-5xl sm:text-6xl font-bold leading-tight text-[#FFF8F0]">
                Design Your
                <span className="block text-[#FFDAB9]\">Luxury Space</span>
              </h1>
              
              <p className="text-lg text-[#FFF8F0]/70 leading-relaxed max-w-lg">
                Discover premium, hand-crafted furniture that transforms your home. Curated collection of timeless pieces designed for elegant living.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-8 py-4 text-base font-bold text-[#2E1F13] transition hover:bg-[#E5C158] hover:scale-105 shadow-lg shadow-[#D4AF37]/30"
              >
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <button
                onClick={() => document.getElementById('collections').scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#FFDAB9] px-8 py-4 text-base font-bold text-[#FFDAB9] transition hover:bg-[#FFDAB9]/10"
              >
                Explore Collections
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-[#FFF8F0]/80">
                <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free Delivery
              </div>
              <div className="flex items-center gap-2 text-sm text-[#FFF8F0]/80">
                <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Easy Returns
              </div>
              <div className="flex items-center gap-2 text-sm text-[#FFF8F0]/80">
                <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure Payment
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[500px] hidden lg:block">
            <div className="absolute inset-0 rounded-[2rem] border border-[#FFDAB9]/20 bg-gradient-to-br from-[#A67B5B]/20 to-transparent overflow-hidden">
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#A67B5B]/20 flex items-center justify-center mx-auto">
                    <Sofa className="w-20 h-20 text-[#FFDAB9]" />
                  </div>
                  <p className="text-[#FFF8F0]/60 font-serif text-2xl">Premium Furniture Collection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
