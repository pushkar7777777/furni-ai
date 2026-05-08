import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Sofa, Globe, MessageSquare, Camera, Share2, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = memo(() => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#1d120c] to-[#0f0a07] border-t border-white/10">
      {/* Newsletter Section */}
      <div className="border-b border-white/10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-center">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-[#FFF8F0] font-serif mb-2">
                Join Our Newsletter
              </h3>
              <p className="text-[#FFF8F0]/70">
                Get exclusive deals, design tips, and early access to new collections.
              </p>
            </div>

            {/* Subscription Form */}
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-white/10 bg-[#2E1F13]/60 px-4 py-3 text-sm text-[#FFF8F0] placeholder-[#FFF8F0]/40 outline-none focus:border-[#D4AF37]/40 transition-colors"
                required
              />
              <button
                type="submit"
                className="rounded-full bg-[#D4AF37] text-[#2E1F13] font-semibold px-6 py-3 hover:bg-[#E5C158] transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {subscribed ? '✓ Done' : 'Subscribe'}
                {!subscribed && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand Column */}
            <div className="space-y-6">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 bg-[#A67B5B] rounded-xl flex items-center justify-center shadow-lg shadow-[#A67B5B]/20 group-hover:scale-110 transition-transform">
                  <Sofa className="w-5 h-5 text-[#FFF8F0]" />
                </div>
                <span className="font-serif text-lg font-bold text-[#FFF8F0]">
                  Saikamal<span className="font-light italic text-[#FFDAB9]"> Furnitures</span>
                </span>
              </Link>

              <p className="text-sm text-[#FFF8F0]/70 leading-relaxed">
                Crafting timeless elegance and comfort with premium furniture. Your trusted partner in creating beautiful, luxurious homes.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {[Globe, MessageSquare, Camera, Share2].map((Icon, idx) => (
                  <button
                    key={idx}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#FFF8F0]/60 hover:bg-[#A67B5B]/20 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-[#FFF8F0] uppercase tracking-[0.1em] text-sm">
                Quick Links
              </h4>
              {[
                { label: 'Home', to: '/' },
                { label: 'Products', to: '/products' },
                { label: 'Offers', to: '/offers' },
                { label: 'Cart', to: '/cart' },
                { label: 'Account', to: '/account' }
              ].filter(link => {
                const userRole = localStorage.getItem('user_role');
                if (userRole && userRole !== 'customer') {
                  return ['Home', 'Account'].includes(link.label);
                }
                return true;
              }).map((link, idx) => (
                <Link
                  key={idx}
                  to={link.to}
                  className="block text-sm text-[#FFF8F0]/70 hover:text-[#D4AF37] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <h4 className="font-bold text-[#FFF8F0] uppercase tracking-[0.1em] text-sm">
                Customer Service
              </h4>
              {[
                { label: 'EMI Plans', to: '/emi' },
                { label: 'Exchange', to: '/exchange' },
                { label: 'Rentals', to: '/rentals' },
                { label: 'Services', to: '/service' },
                { label: 'Suppliers', to: '/suppliers' }
              ].map((link, idx) => (
                <Link
                  key={idx}
                  to={link.to}
                  className="block text-sm text-[#FFF8F0]/70 hover:text-[#D4AF37] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="font-bold text-[#FFF8F0] uppercase tracking-[0.1em] text-sm">
                Get in Touch
              </h4>

              <div className="space-y-4">
                <a href="tel:+919876543210" className="flex items-start gap-3 text-[#FFF8F0]/70 hover:text-[#D4AF37] transition-colors">
                  <Phone className="w-5 h-5 shrink-0 mt-0.5 text-[#D4AF37]" />
                  <span className="text-sm">+91 9876 543 210</span>
                </a>

                <a href="mailto:info@saikamal.com" className="flex items-start gap-3 text-[#FFF8F0]/70 hover:text-[#D4AF37] transition-colors">
                  <Mail className="w-5 h-5 shrink-0 mt-0.5 text-[#D4AF37]" />
                  <span className="text-sm">info@saikamal.com</span>
                </a>

                <div className="flex items-start gap-3 text-[#FFF8F0]/70">
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-[#D4AF37]" />
                  <span className="text-sm">
                    Saikamal Furnitures, Mumbai<br />
                    Maharashtra, India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-12" />

          {/* Bottom Section */}
          <div className="grid gap-6 sm:grid-cols-2">
            <p className="text-xs text-[#FFF8F0]/50">
              © 2024-2026 Saikamal Furnitures. All rights reserved. |
              <Link to="/service" className="text-[#D4AF37] hover:text-[#FFDAB9] ml-1">Terms & Conditions</Link>
            </p>

            <div className="flex items-center justify-end gap-2 text-xs text-[#FFF8F0]/50">
              <span>Secure Payment by:</span>
              <span className="text-[#D4AF37]">Stripe • PayPal • Bank Transfer</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
